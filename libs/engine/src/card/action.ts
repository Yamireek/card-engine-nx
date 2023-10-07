import { CardState, CardAction, Action } from '@card-engine-nx/state';
import { ExecutionContext } from '../context';
import { uiEvent } from '../eventFactories';
import { getCardZoneId, getZoneState } from '../zone/target';
import { calculateBoolExpr, calculateNumberExpr } from '../expr';
import { isArray } from 'lodash';
import {
  GameZoneType,
  PlayerZoneType,
  ZoneId,
  getZoneType,
} from '@card-engine-nx/basic';
import { getTargetCard, getTargetCards } from './target';
import { createPayCostAction } from '../resolution';

export function executeCardAction(
  action: CardAction,
  card: CardState,
  ctx: ExecutionContext
) {
  if (isArray(action)) {
    const actions: Action[] = action.map((a) => ({
      card: { target: card.id, action: a },
    }));

    ctx.state.next.unshift(...actions);
    return;
  }

  if (action === 'empty') {
    return;
  }

  if (action === 'ready') {
    card.tapped = false;
    return;
  }

  if (action === 'travel') {
    const travelCost = ctx.view.cards[card.id].travel ?? [];
    ctx.state.next.unshift(
      ...travelCost,
      {
        card: {
          target: card.id,
          action: {
            move: {
              from: 'stagingArea',
              to: 'activeLocation',
              side: 'front',
            },
          },
        },
      },
      { event: { type: 'traveled', card: card.id } }
    );
    return;
  }

  if (action === 'exhaust') {
    card.tapped = true;
    return;
  }

  if (action === 'reveal') {
    if (card.sideUp === 'back') {
      ctx.state.next.unshift({
        card: {
          target: card.id,
          action: [{ flip: 'front' }, 'reveal'],
        },
      });
      return;
    }

    const props = ctx.view.cards[card.id].props;

    ctx.state.next.unshift(
      { event: { type: 'revealed', card: card.id } },
      {
        card: {
          target: card.id,
          action: {
            move: {
              from: 'encounterDeck',
              to: props.type === 'treachery' ? 'discardPile' : 'stagingArea',
              side: 'front',
            },
          },
        },
      }
    );

    return;
  }

  if (action === 'shuffleToDeck') {
    if (card.owner) {
      ctx.state.next.unshift(
        {
          card: {
            target: card.id,
            action: {
              move: {
                to: {
                  owner: card.owner,
                  type: 'library',
                },
                side: 'back',
              },
            },
          },
        },
        {
          player: {
            target: card.owner,
            action: 'shuffleLibrary',
          },
        }
      );
    }

    return;
  }

  if (action === 'discard') {
    card.tapped = false;
    card.token = { damage: 0, progress: 0, resources: 0 };
    card.mark = {
      attacked: false,
      attacking: false,
      defending: false,
      questing: false,
    };

    const owner = card.owner;

    ctx.state.next.unshift({
      card: {
        target: card.id,
        action: {
          move: {
            to: !owner ? 'discardPile' : { type: 'discardPile', owner },
            side: 'front',
          },
        },
      },
    });
    return;
  }

  if (action === 'advance') {
    const quest = ctx.view.cards[card.id];

    card.token.progress = 0;

    const removedExplored: Action = {
      card: {
        target: card.id,
        action: {
          move: {
            from: 'questArea',
            to: 'removed',
            side: 'front',
          },
        },
      },
    };

    const next = getTargetCards(
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

    if (next.length === 0) {
      console.log('game won');
      ctx.state.result = {
        win: true,
        score: 1,
      };
      return;
    }

    if (next.length === 1) {
      ctx.state.next.unshift(
        removedExplored,
        {
          card: {
            target: next,
            action: [
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
        {
          event: {
            type: 'revealed',
            card: next[0],
          },
        }
      );
    } else {
      if (quest.nextStage === 'random') {
        const rnd = ctx.random.item(next);
        ctx.state.next.unshift(
          removedExplored,
          {
            card: {
              target: rnd,
              action: [
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
          {
            event: {
              type: 'revealed',
              card: rnd,
            },
          }
        );
      } else {
        throw new Error('found multiple stages');
      }
    }
    return;
  }

  if (action === 'draw') {
    const owner = card.owner;

    if (!owner) {
      throw new Error("can't draw card without owner");
    }

    const ow = ctx.view.players[owner];
    if (ow?.disableDraw) {
      return;
    }

    ctx.state.next.unshift({
      card: {
        target: card.id,
        action: {
          move: {
            to: { type: 'hand', owner },
            side: 'front',
          },
        },
      },
    });
    return;
  }

  if (action === 'explore') {
    card.tapped = false;
    card.token = { damage: 0, progress: 0, resources: 0 };
    card.mark = {
      attacked: false,
      attacking: false,
      defending: false,
      questing: false,
    };

    ctx.state.next.unshift(
      {
        event: {
          type: 'explored',
          card: card.id,
        },
      },
      {
        card: {
          target: card.id,
          action: {
            move: {
              to: 'discardPile',
              side: 'front',
            },
          },
        },
      }
    );
    return;
  }

  if (action === 'destroy' || action.destroy) {
    card.tapped = false;
    card.token = { damage: 0, progress: 0, resources: 0 };
    card.mark = {
      attacked: false,
      attacking: false,
      defending: false,
      questing: false,
    };

    const owner = card.owner;

    ctx.state.next.unshift(
      {
        card: {
          target: card.id,
          action: {
            move: {
              to: !owner ? 'discardPile' : { type: 'discardPile', owner },
              side: 'front',
            },
          },
        },
      },
      {
        event: {
          type: 'destroyed',
          card: card.id,
          attackers:
            action === 'destroy' ? [] : action.destroy?.attackers ?? [],
        },
      }
    );

    return;
  }

  if (action.payCost) {
    const controller = card.controller;
    if (!controller) {
      return;
    }

    const payCostAction = createPayCostAction(card.id, action.payCost, ctx);
    if (payCostAction) {
      ctx.state.next.unshift({
        player: {
          target: controller,
          action: payCostAction,
        },
      });
    }
    return;
  }

  if (action.ready === 'refresh') {
    const cv = ctx.view.cards[card.id];
    const free = cv.refreshCost.length === 0;
    if (free) {
      ctx.state.next.unshift({ card: { target: card.id, action: 'ready' } });
    } else {
      if (card.controller) {
        ctx.state.next.unshift({
          player: {
            target: card.controller,
            action: {
              chooseActions: {
                title: 'Pay for refresh?',
                actions: [
                  {
                    title: 'Yes',
                    action: {
                      card: {
                        target: card.id,
                        action: [...cv.refreshCost, 'ready'],
                      },
                    },
                  },
                ],
                multi: false,
                optional: true,
              },
            },
          },
        });
      }
    }

    return;
  }

  if (action.declareAsDefender) {
    card.tapped = true;
    card.mark.defending = true;
    ctx.state.next.unshift({
      event: {
        type: 'declaredAsDefender',
        card: card.id,
        attacker: action.declareAsDefender.attacker,
      },
    });
    return;
  }

  if (action.engagePlayer) {
    ctx.state.next.unshift(
      {
        card: {
          target: card.id,
          action: {
            move: {
              from: 'stagingArea',
              to: { owner: action.engagePlayer, type: 'engaged' },
              side: 'front',
            },
          },
        },
      },
      {
        event: {
          type: 'engaged',
          card: card.id,
          player: action.engagePlayer,
        },
      }
    );
    return;
  }

  if (action.heal) {
    if (action.heal === 'all') {
      card.token.damage = 0;
    } else {
      card.token.damage = Math.max(0, card.token.damage - action.heal);
    }

    return;
  }

  if (action.dealDamage) {
    const data =
      typeof action.dealDamage === 'number'
        ? { amount: action.dealDamage, attackers: [] }
        : action.dealDamage;

    const amount = data.amount;

    card.token.damage += amount;

    const hitpoints = ctx.view.cards[card.id].props.hitPoints;

    if (hitpoints && card.token.damage >= hitpoints) {
      executeCardAction(
        {
          destroy: {
            attackers: data.attackers,
          },
        },
        card,
        ctx
      );
    }

    ctx.state.next.unshift({
      event: {
        type: 'receivedDamage',
        card: card.id,
        damage: amount,
      },
    });

    return;
  }

  if (action.flip) {
    card.sideUp = action.flip;
    return;
  }

  if (action.generateResources) {
    const amount = calculateNumberExpr(action.generateResources, ctx);
    card.token.resources += amount;
    return;
  }

  if (action.payResources !== undefined) {
    card.token.resources -= action.payResources;
    return;
  }

  if (action.move) {
    if (action.move.from) {
      if (card.zone !== getZoneType(action.move.from)) {
        return;
      }
    }

    const fromId = action.move.from ?? getCardZoneId(card.id, ctx.state);
    const sourceZone = getZoneState(fromId, ctx.state);
    const destinationZone = getZoneState(action.move.to, ctx.state);

    const sourceInGame = isInGame(fromId);
    const destInGame = isInGame(action.move.to);

    sourceZone.cards = sourceZone.cards.filter((c) => c !== card.id);
    destinationZone.cards.push(card.id);
    card.sideUp = action.move.side;
    card.zone =
      typeof action.move.to === 'string' ? action.move.to : action.move.to.type;

    ctx.events.send(
      uiEvent.card_moved({
        cardId: card.id,
        source: fromId,
        destination: action.move.to,
        side: action.move.side,
      })
    );

    if (!sourceInGame && destInGame) {
      ctx.state.next.unshift({ event: { type: 'enteredPlay', card: card.id } });
    }
    return;
  }

  if (action.placeProgress) {
    card.token.progress += action.placeProgress;
    const cw = ctx.view.cards[card.id];
    if (cw.props.type === 'quest') {
      const qp = cw.props.questPoints;
      if (qp && card.token.progress >= qp) {
        const canAdvance =
          cw.conditional.advance.length > 0
            ? calculateBoolExpr({ and: cw.conditional.advance }, ctx)
            : true;

        if (canAdvance) {
          executeCardAction('advance', card, ctx);
        }
      }
    }

    if (cw.props.type === 'location') {
      const qp = cw.props.questPoints;
      if (qp && card.token.progress >= qp) {
        executeCardAction('explore', card, ctx);
      }
    }

    return;
  }

  if (action.resolveEnemyAttacking) {
    ctx.state.next.unshift(
      {
        card: {
          target: card.id,
          action: { mark: 'attacking' },
        },
      },
      { playerActions: 'Declare defender' },
      {
        player: {
          target: action.resolveEnemyAttacking,
          action: 'declareDefender',
        },
      },
      {
        player: {
          target: action.resolveEnemyAttacking,
          action: 'determineCombatDamage',
        },
      },
      { clearMarks: 'attacking' },
      { clearMarks: 'defending' },
      {
        card: {
          target: card.id,
          action: { mark: 'attacked' },
        },
      }
    );
    return;
  }

  if (action.resolvePlayerAttacking) {
    const enemy = card.id;
    ctx.state.next.unshift(
      { card: { target: enemy, action: { mark: 'defending' } } },
      { playerActions: 'Declare attackers' },
      {
        player: {
          target: action.resolvePlayerAttacking,
          action: {
            declareAttackers: enemy,
          },
        },
      },
      { playerActions: 'Determine combat damage' },
      {
        player: {
          target: action.resolvePlayerAttacking,
          action: 'determineCombatDamage',
        },
      },
      { clearMarks: 'attacking' },
      { clearMarks: 'defending' },
      { card: { target: enemy, action: { mark: 'attacked' } } }
    );
    return;
  }

  if (action.mark) {
    card.mark[action.mark] = true;
    return;
  }

  if (action.attachCard) {
    const target = getTargetCard(action.attachCard, ctx);
    if (target) {
      card.attachments.push(target);
      ctx.state.cards[target].attachedTo = card.id;
      ctx.state.next.unshift({
        card: {
          target,
          action: {
            move: {
              side: 'front',
              to: {
                type: card.zone,
                owner: card.owner,
              } as any,
            },
          },
        },
      });
    }
    return;
  }

  if (action.modify) {
    if (isArray(action.modify)) {
      for (const modifier of action.modify) {
        ctx.state.modifiers.push({
          source: 0, // TODO fix
          card: card.id,
          modifier,
          until: action.until,
        });
      }
    } else {
      ctx.state.modifiers.push({
        source: 0, // TODO fix
        card: card.id,
        modifier: action.modify,
        until: action.until,
      });
    }
    return;
  }

  if (action.setAsVar) {
    ctx.state.vars.card[action.setAsVar] = card.id;
    return;
  }

  if (action.clear) {
    card.mark[action.clear] = false;
    return;
  }

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}

export function isInGame(zone: ZoneId) {
  const inGameZones: Array<GameZoneType | PlayerZoneType> = [
    'activeLocation',
    'stagingArea',
    'playerArea',
    'engaged',
  ];

  if (typeof zone === 'string') {
    return inGameZones.includes(zone);
  } else {
    return inGameZones.includes(zone.type);
  }
}
