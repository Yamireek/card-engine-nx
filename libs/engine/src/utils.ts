import {
  CardDefinition,
  Scope,
  State,
  View,
  createCardState,
} from '@card-engine-nx/state';
import {
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
} from '@card-engine-nx/basic';
import { executeAction } from './action/execute';
import { ExecutionContext } from './context/execution';
import { UIEvents } from './events/uiEvents';
import { createView } from './view';
import { Random } from './utils/random';
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
): boolean {
  const action = ctx.state.next.shift();
  if (!action) {
    return false;
  } else {
    logger.log('executing ', toJS(action), toJS(ctx.state.next));
    const result = executeAction(action, ctx, scopes);
    return result ?? false;
  }
}

export function createExecutionContext(
  state: State,
  events: UIEvents,
  random: Random
): ExecutionContext {
  let view: View | undefined = undefined;
  return {
    state,
    events,
    random,
    get view() {
      if (view) {
        return view;
      } else {
        view = createView(state);
        return view;
      }
    },
  };
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
      const actions = createView(state).actions.filter((a) => a.enabled);
      if (actions.length === 0) {
        state.choice = undefined;
      }
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
