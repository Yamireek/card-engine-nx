import { uniq, cloneDeep, last } from 'lodash';
import { isObservable, toJS } from 'mobx';
import { Sphere, PlayerId, CardId, mergeKeywords } from '@card-engine-nx/basic';
import { Action, PrintedProps, PropertyModifier } from '@card-engine-nx/state';

export function createPlayAllyAction(
  sphere: Sphere[],
  cost: number,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: owner,
    action: { payResources: { amount: cost, sphere } },
  };

  const moveToPlay: Action = {
    card: self,
    action: {
      move: {
        from: { player: owner, type: 'hand' },
        to: { player: owner, type: 'playerArea' },
      },
    },
  };

  return {
    useScope: [
      {
        var: 'self',
        card: self,
      },
      {
        var: 'controller',
        player: owner,
      },
    ],
    action: {
      payment: {
        cost: payment,
        effect: [moveToPlay, { event: { type: 'played', card: self } }],
      },
    },
  };
}

export function applyModifiers(
  printed: PrintedProps,
  modifiers: PropertyModifier[]
): PrintedProps {
  if (modifiers.length === 0) {
    return printed;
  }

  const draft = isObservable(printed) ? toJS(printed) : cloneDeep(printed);
  const modified = uniq(modifiers.map((m) => m.prop));

  for (const property of modified) {
    const mods = modifiers.flatMap((m) => (m.prop === property ? m : []));
    const sets = mods.flatMap((m) => (m.op === 'set' ? m : []));
    if (sets.length > 0) {
      const applied = last(sets);
      if (applied) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        draft[property] = applied.value as any;
      }
    } else {
      const incs = mods.flatMap((m) => (m.op === 'inc' ? m : []));
      const muls = mods.flatMap((m) => (m.op === 'mul' ? m : []));
      let value = printed[property] as number;
      for (const mod of incs) {
        value += mod.value;
      }
      for (const mod of muls) {
        value *= mod.value;
      }
      if (value < 0) {
        value = 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draft[property] = Math.ceil(value) as any;
    }

    if (property === 'traits') {
      const added = mods.flatMap((m) =>
        m.op === 'add' && m.prop === 'traits' ? m.value : []
      );
      draft.traits = uniq([...(printed.traits ?? []), ...added]);
    }

    if (property === 'sphere') {
      const added = mods.flatMap((m) =>
        m.op === 'add' && m.prop === 'sphere' ? m.value : []
      );
      draft.sphere = uniq([...(printed.sphere ?? []), ...added]);
    }

    if (property === 'keywords') {
      const added = mods.flatMap((m) =>
        m.op === 'add' && m.prop === 'keywords' ? m.value : []
      );
      draft.keywords = mergeKeywords(printed.keywords ?? {}, ...added);
    }
  }

  return draft;
}
