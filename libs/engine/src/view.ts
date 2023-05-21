import { State, View } from '@card-engine-nx/state';
import { cloneDeep, mapValues, values } from 'lodash';
import { applyModifier } from './card/modifier';
import { applyAbility } from './card/ability';
import { createCardView } from './card/view';

export function createView(state: State): View {
  const view: View = cloneDeep({
    cards: mapValues(state.cards, (c) => createCardView(c)),
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const card of values(view.cards)) {
      for (const ability of card.abilities.filter((a) => !a.applied)) {
        allApplied = false;
        applyAbility(ability.ability, state, card);
        ability.applied = true;
      }

      for (const modifier of card.modifiers.filter((m) => !m.applied)) {
        allApplied = false;
        applyModifier(modifier.modifier, state, card, { selfCard: card.id });
        modifier.applied = true;
      }
    }

    if (allApplied) {
      break;
    }
  }

  return view;
}
