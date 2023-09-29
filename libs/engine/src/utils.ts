import {
  Action,
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
import { ExecutionContext, ViewContext } from './context';
import { uiEvent } from './eventFactories';
import { UIEvents } from './uiEvents';
import { createView } from './view';
import { getTargetCards } from './card';

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
  shuffle: <T>(items: T[]) => T[]
): ExecutionContext {
  let view: View | undefined = undefined;
  return {
    state,
    events,
    shuffle,
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

// TODO less params
export function advanceToChoiceState(
  state: State,
  events: UIEvents,
  autoSkip: boolean,
  stopOnError: boolean,
  shuffle: <T>(items: T[]) => T[],
  randomItem: <T>(items: T[]) => T
) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (state.choice) {
      if (
        state.choice.type === 'single' &&
        ((!state.choice.optional && state.choice.options.length === 1) ||
          (state.choice.optional && state.choice.options.length === 0))
      ) {
        if (state.choice.options.length > 0) {
          state.next.unshift(state.choice.options[0].action);
        }
        state.choice = undefined;
      } else if (
        autoSkip &&
        state.choice.type === 'actions' &&
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
      nextStep(crateExecutionContext(state, events, shuffle));

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
          const qp = view.cards[c.id].props.questPoints;
          const progress = c.token.progress;
          return qp !== undefined && progress >= qp;
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
        const quest = view.cards[exploredQuest[0]];

        const removedExplored: Action = {
          card: {
            target: exploredQuest,
            action: {
              move: {
                from: 'questArea',
                to: 'removed',
                side: 'front',
              },
            },
          },
        };

        const ctx: ViewContext = { state, view, card: {}, player: {} };

        const nextQuest = getTargetCards(
          {
            and: [
              {
                zone: 'questDeck',
              },
              {
                sequence: {
                  plus: [{ card: { target: quest.id, value: 'sequence' } }, 1],
                },
              },
            ],
          },
          ctx
        );

        if (nextQuest.length === 0) {
          console.log('game won');
          state.result = {
            win: true,
            score: 1,
          };
          return;
        }

        if (nextQuest.length === 1) {
          state.next.unshift(removedExplored, {
            card: {
              target: nextQuest,
              action: {
                sequence: [
                  {
                    move: {
                      from: 'questDeck',
                      to: 'questArea',
                      side: 'front',
                    },
                  },
                  { flip: 'back' },
                ],
              },
            },
          });
        } else {
          if (quest.nextStage === 'random') {
            const rnd = randomItem(nextQuest);
            state.next.unshift(removedExplored, {
              card: {
                target: rnd,
                action: {
                  sequence: [
                    {
                      move: {
                        from: 'questDeck',
                        to: 'questArea',
                        side: 'front',
                      },
                    },
                    { flip: 'back' },
                  ],
                },
              },
            });
          } else {
            throw new Error('found multiple stages');
          }
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
