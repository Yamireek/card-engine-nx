import {
  CardDefinition,
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
import { uiEvent } from './events/eventFactories';
import { UIEvents } from './events/uiEvents';
import { createView } from './view';
import { Random } from './utils/random';
import { isArray } from 'lodash/fp';

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

export function nextStep(ctx: ExecutionContext): boolean {
  const action = ctx.state.next.shift();
  if (!action) {
    return false;
  } else {
    console.log('executing ', JSON.parse(JSON.stringify(action)));
    const result = executeAction(action, ctx);
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
    scopes: [],
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

export function chooseOnlyOption(
  state: State,
  skip: { show: boolean; actions: boolean }
) {
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

// TODO less params
export function advanceToChoiceState(
  state: State,
  events: UIEvents,
  skip: { show: boolean; actions: boolean },
  stopOnError: boolean,
  random: Random
) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    chooseOnlyOption(state, skip);

    if (state.choice) {
      return;
    }

    if (state.next.length === 0) {
      return;
    }

    try {
      const ctx = createExecutionContext(state, events, random);
      while (ctx !== undefined) {
        const newView = nextStep(ctx);
        if (newView || ctx.state.choice || ctx.state.next.length === 0) {
          break;
        }
      }

      if (state.result) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      events.send(uiEvent.error(error.message));
      if (stopOnError) {
        throw error;
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

export function asArray<T>(item?: T | T[]): T[] {
  if (!item) {
    return [];
  }

  if (isArray(item)) {
    return item;
  } else {
    return [item];
  }
}
