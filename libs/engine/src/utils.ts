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
  values,
} from '@card-engine-nx/basic';
import { executeAction } from './action';
import { ExecutionContext } from './context';
import { uiEvent } from './eventFactories';
import { UIEvents } from './uiEvents';
import { createView } from './view';
import { calculateBoolExpr } from './expr';
import { Random } from './utils/random';

export function addPlayerCard(
  state: State,
  definition: CardDefinition,
  owner: PlayerId,
  side: Side,
  zone: PlayerZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, owner, zone);
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

export function nextStep(ctx: ExecutionContext) {
  const action = ctx.state.next.shift();
  if (!action) {
    return;
  } else {
    console.log('executing ', JSON.parse(JSON.stringify(action)));
    executeAction(action, ctx);
  }
}

export function crateExecutionContext(
  state: State,
  events: UIEvents,
  random: Random
): ExecutionContext {
  let view: View | undefined = undefined;
  return {
    state,
    events,
    random,
    card: {},
    player: {},
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
      nextStep(crateExecutionContext(state, events, random));

      if (state.result) {
        return;
      }

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
        state.next.unshift({
          card: { target: destoryed, action: 'destroy' },
        });
      }

      const exploredLocations = values(state.cards)
        .filter((c) => {
          const props = view.cards[c.id].props;
          const qp = props.questPoints;
          const progress = c.token.progress;
          return (
            qp !== undefined && progress >= qp && props.type === 'location'
          );
        })
        .map((c) => c.id);

      // TODO json target
      if (exploredLocations.length > 0) {
        state.next.unshift({
          card: {
            target: exploredLocations,
            action: 'destroy',
          },
        });
      }

      const exploredQuest = state.zones.questArea.cards.filter((id) => {
        const qp = view.cards[id].props.questPoints;
        const progress = state.cards[id].token.progress;
        return qp !== undefined && progress >= qp;
      });

      if (exploredQuest.length === 1) {
        const conditions = view.cards[exploredQuest[0]].conditional.advance;
        const canAdvance =
          conditions.length > 0
            ? calculateBoolExpr(
                { and: conditions },
                { state, view, card: {}, player: {} }
              )
            : true;

        if (canAdvance) {
          state.next.unshift({
            card: {
              target: exploredQuest,
              action: 'advance',
            },
          });
        }
      }

      const eliminated = values(state.players)
        .filter((p) => {
          const heroes = p.zones.playerArea.cards.filter(
            (id) => view.cards[id].props.type === 'hero'
          );

          return !p.eliminated && heroes.length === 0;
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
        state.result = {
          win: false,
          score: 0,
        };
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
export function isInPlay(zone: PlayerZoneType | GameZoneType): boolean {
  switch (zone) {
    case 'activeLocation':
    case 'engaged':
    case 'playerArea':
    case 'questArea':
    case 'stagingArea':
      return true;
    default:
      return false;
  }
}
