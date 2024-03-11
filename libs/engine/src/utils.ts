import {
  CardDefinition,
  Scope,
  State,
  createCardState,
  createCardView,
} from '@card-engine-nx/state';
import {
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
  values,
} from '@card-engine-nx/basic';
import { executeAction } from './action/execute';
import { ExecutionContext } from './context/execution';
import { applyGlobalCardModifier, applyGlobalPlayerModifier } from './view';
import { Logger } from './logger/types';
import { toJS } from 'mobx';

// TODO replace with action
export function addPlayerCard(
  state: State,
  definition: CardDefinition,
  owner: PlayerId,
  side: Side,
  zone: PlayerZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, owner, {
    player: owner,
    type: zone,
  });
  state.players[owner]?.zones[zone].cards.push(id);
  state.nextId++;
  return id;
}

// TODO replace with action
export function addGameCard(
  state: State,
  definition: CardDefinition,
  side: Side,
  zone: GameZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, undefined, zone);
  state.zones[zone].cards.push(id);
  state.nextId++;
}

export function nextStep(
  ctx: ExecutionContext,
  logger: Logger,
  scopes: Scope[]
) {
  const action = ctx.state.next.shift();
  if (!action) {
    return false;
  } else {
    logger.log('executing ', toJS(action), toJS(ctx.state.next));
    executeAction(action, ctx, scopes);
    if (ctx.state.invalidate) {
      invalidateState(ctx.state);
    }
  }
}

export function invalidateState(state: State) {
  for (const player of values(state.players)) {
    player.view.rules = {};
  }

  for (const card of values(state.cards)) {
    card.view = createCardView(card);
  }

  for (const modifier of state.modifiers) {
    modifier.applied = false;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const modifier of state.modifiers.filter((m) => !m.applied)) {
      allApplied = false;

      if ('card' in modifier) {
        applyGlobalCardModifier(state, modifier);
      }

      if ('player' in modifier) {
        applyGlobalPlayerModifier(state, modifier);
      }

      modifier.applied = true;
    }

    if (allApplied) {
      break;
    }
  }

  state.invalidate = false;
}

export type SkipOptions = { show: boolean; actions: boolean };

export function chooseOnlyOption(state: State, skip: SkipOptions) {
  const choice = state.choice;

  if (!choice) {
    return;
  }

  if (choice.type === 'show') {
    if (skip.show) {
      state.choice = undefined;
    }
  }

  if (choice.type === 'single') {
    if (choice.optional && choice.options.length === 0) {
      state.choice = undefined;
    }

    if (!choice.optional && choice.options.length === 1) {
      state.next.unshift(...choice.options.map((o) => o.action));
      state.choice = undefined;
    }

    if (!choice.optional && choice.options.length === 0) {
      state.choice = undefined;
    }
  }

  if (choice.type === 'multi') {
    if (choice.options.length === 0) {
      state.choice = undefined;
    }
  }

  if (choice.type === 'actions') {
    if (skip.actions) {
      throw new Error('todo');
      // TODO
      // const actions = createView(state).actions.filter((a) => a.enabled);
      // if (actions.length === 0) {
      //   state.choice = undefined;
      // }
    }
  }
}

export function single<T>(items: T[]): T {
  if (items.length === 1) {
    return items[0];
  } else {
    throw new Error('expecting 1 item');
  }
}
