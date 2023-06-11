import {
  CardDefinition,
  CardState,
  PlayerState,
  State,
  View,
} from '@card-engine-nx/state';
import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
  values,
} from '@card-engine-nx/basic';
import { executeAction } from './action';
import { ExecutionContext } from './context';
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
    eliminated: false,
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

export function crateContext(
  state: State,
  events: UIEvents,
  shuffle: <T>(items: T[]) => T[]
): ExecutionContext {
  let view: View | undefined = undefined;
  return {
    state,
    events,
    shuffle,
    card: {},
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

export function advanceToChoiceState(
  state: State,
  events: UIEvents,
  autoSkip: boolean,
  stopOnError: boolean,
  shuffle: <T>(items: T[]) => T[]
) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (state.choice) {
      if (
        state.choice.multi === false &&
        state.choice.dialog &&
        ((!state.choice.optional && state.choice.options.length === 1) ||
          (state.choice.optional && state.choice.options.length === 0))
      ) {
        if (state.choice.options.length > 0) {
          state.next.unshift(state.choice.options[0].action);
        }
        state.choice = undefined;
      } else if (
        autoSkip &&
        !state.choice.dialog &&
        createView(state).actions.length === 0
      ) {
        state.choice = undefined;
      } else {
        return state;
      }
    }

    if (state.next.length === 0) {
      return;
    }

    try {
      nextStep(crateContext(state, events, shuffle));

      const view = createView(state);
      const destoryed = values(state.cards)
        .filter((c) => {
          const hp = view.cards[c.id].props.hitPoints;
          const damage = c.token.damage;
          if (hp !== undefined && damage >= hp) {
            return true;
          }
        })
        .map((c) => c.id);

      // TODO json target
      if (destoryed.length > 0) {
        state.next.unshift({ card: { taget: destoryed, action: 'destroy' } });
      }

      const explored = values(state.cards)
        .filter((c) => {
          const qp = view.cards[c.id].props.questPoints;
          const progress = c.token.progress;
          if (qp !== undefined && progress >= qp) {
            return true;
          }
        })
        .map((c) => c.id);

      // TODO json target
      if (explored.length > 0) {
        state.next.unshift({ card: { taget: explored, action: 'destroy' } });
      }

      const eliminated = values(state.players)
        .filter((p) => {
          const heroes = p.zones.playerArea.cards.filter(
            (id) => view.cards[id].props.type === 'hero'
          );

          return !p.eliminated && (p.thread >= 50 || heroes.length === 0);
        })
        .map((s) => s.id);

      if (eliminated.length > 0) {
        state.next.unshift({
          player: { target: eliminated, action: 'eliminate' },
        });
      }

      const notEleliminated = values(state.players).filter(
        (p) => !p.eliminated
      );

      if (notEleliminated.length === 0) {
        console.log('game lost');
        state.result = 'lost';
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
