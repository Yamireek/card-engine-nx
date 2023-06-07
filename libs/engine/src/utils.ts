import {
  Action,
  CardDefinition,
  CardState,
  PlayerState,
  State,
} from '@card-engine-nx/state';
import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
} from '@card-engine-nx/basic';
import { executeAction } from './action';
import { ExecutionContext } from "./context";
import { uiEvent } from './eventFactories';
import { UIEvents } from './uiEvents';
import { createView } from './view';

export function addPlayerCard(
  state: State,
  definition: CardDefinition,
  owner: PlayerId,
  side: Side,
  zone: PlayerZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, owner);
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
  state.cards[id] = createCardState(id, side, definition, 'game');
  state.zones[zone].cards.push(id);
  state.nextId++;
}

export function createCardState(
  id: CardId,
  side: Side,
  definition: CardDefinition,
  owner: PlayerId | 'game'
): CardState {
  return {
    id,
    token: {
      damage: 0,
      progress: 0,
      resources: 0,
    },
    mark: {
      questing: false,
      attacking: false,
      defending: false,
      attacked: false,
    },
    sideUp: side,
    tapped: false,
    definition: definition,
    attachments: [],
    owner: owner,
    controller: owner,
    limitUses: {
      phase: {},
      round: {},
    },
    modifiers: [],
  };
}

export function createPlayerState(playerId: PlayerId): PlayerState {
  return {
    id: playerId,
    thread: 0,
    zones: {
      hand: { cards: [], stack: false },
      library: { cards: [], stack: true },
      playerArea: { cards: [], stack: false },
      discardPile: { cards: [], stack: true },
      engaged: { cards: [], stack: false },
    },
    limitUses: { game: {} },
    flags: {},
  };
}

export function nextStep(ctx: ExecutionContext) {
  const action = ctx.state.next.shift();
  if (!action) {
    return;
  } else {
    executeAction(action, ctx);
  }
}

export function advanceToChoiceState(
  state: State,
  events: UIEvents,
  stopOnError: boolean
) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (state.choice) {
      if (state.choice.multi === false && state.choice.options.length === 1) {
        state.next.unshift(state.choice.options[0].action);
        state.choice = undefined;
      } else {
        events.send(uiEvent.newState(state));
        return state;
      }
    }

    if (state.next.length === 0) {
      events.send(uiEvent.newState(state));
      return;
    }

    try {
      nextStep({ state, view: createView(state), events, card: {} });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      events.send(uiEvent.error(error.message));
      events.send(uiEvent.newState(state));
      if (stopOnError) {
        throw error;
      }
    }
  }
}

export function sequence(...actions: Action[]): Action {
  return {
    sequence: actions,
  };
}

export function single<T>(items: T[]): T {
  if (items.length === 1) {
    return items[0];
  } else {
    throw new Error('expecting 1 item');
  }
}
