import { CardState, CardAction, Action } from '@card-engine-nx/state';
import { ExecutionContext } from '../context';
import { uiEvent } from '../eventFactories';
import {
  getCardZoneId,
  getTargetZone,
  getTargetZoneId,
  getZoneState,
  getZoneType,
} from '../zone/target';
import { calculateBoolExpr, calculateNumberExpr } from '../expr';
import { isArray } from 'lodash';
import {
  GameZoneType,
  PlayerZoneType,
  ZoneId,
  ZoneType,
  zonesEqual,
} from '@card-engine-nx/basic';
import { getTargetCard, getTargetCards } from './target';
import { createPayCostAction } from '../resolution';
import { getTargetPlayer } from '../player/target';

export function executeCardAction(
  action: CardAction,
  card: CardState,
  ctx: ExecutionContext
): undefined | boolean {
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
    return true;
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
    return true;
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
                  player: card.owner,
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
    const owner = card.owner;

    ctx.state.next.unshift({
      card: {
        target: card.id,
        action: {
          move: {
            to: !owner ? 'discardPile' : { type: 'discardPile', player: owner },
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
          },
        },
      },
    };

    const next = getTargetCards(
      {
        zone: 'questDeck',
        sequence: {
          plus: [{ card: { target: quest.id, value: 'sequence' } }, 1],
        },
      },
      ctx
    );

    if (next.length === 0) {
      ctx.state.next.unshift('win');
      return;
    }

    // TODO merge conditions
    if (next.length === 1) {
      ctx.state.next.unshift(
        removedExplored,
        {
          choice: {
            id: ctx.state.nextId++,
            type: 'show',
            title: 'Next quest card',
            cardId: next[0],
          },
        },
        {
          card: {
            target: next,
            action: [
              {
                move: {
                  from: 'questDeck',
                  to: 'questArea',
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
            choice: {
              id: ctx.state.nextId++,
              type: 'show',
              title: 'Next quest card',
              cardId: rnd,
            },
          },
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
            to: { type: 'hand', player: owner },
            side: 'front',
          },
        },
      },
    });
    return;
  }

  if (action === 'explore') {
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
            },
          },
        },
      }
    );
    return;
  }

  if (action === 'commitToQuest') {
    ctx.state.next.unshift({
      card: {
        target: card.id,
        action: ['exhaust', { mark: 'questing' }],
      },
    });
    return;
  }

  if (action === 'resolveShadowEffects') {
    const cards = ctx.state.cards[card.id].shadows.flatMap(
      (id) => ctx.view.cards[id]
    );

    if (cards.length > 0) {
      ctx.state.next.unshift(
        {
          card: cards.map((s) => s.id),
          action: {
            flip: 'shadow',
          },
        },
        {
          card: cards.map((s) => s.id),
          action: 'resolveShadow',
        }
      );
    }

    return;
  }

  if (action === 'resolveShadow') {
    const shadows = ctx.view.cards[card.id].shadows;

    if (shadows.length > 0) {
      for (const shadow of shadows) {
        ctx.state.next.unshift(
          {
            choice: {
              title: 'Shadow effect',
              id: ctx.state.nextId++,
              type: 'show',
              cardId: card.id,
            },
          },
          {
            stackPush: {
              type: 'shadow',
              description: shadow.description,
              shadow: {
                useCardVar: {
                  name: 'self',
                  value: card.id,
                  action: shadow.action,
                },
              },
            },
          },
          'stackPop'
        );
      }
    }
    return;
  }

  if (action === 'moveToBottom') {
    const zone = getZoneState(card.zone, ctx.state);
    zone.cards = [card.id, ...zone.cards.filter((id) => id !== card.id)];
    return;
  }

  if (action === 'moveToTop') {
    const zone = getZoneState(card.zone, ctx.state);
    zone.cards = [...zone.cards.filter((id) => id !== card.id), card.id];
    return;
  }

  if (action === 'dealShadowCard') {
    const cardId = card.id;
    const deck = ctx.state.zones.encounterDeck;
    const shadow = deck.cards.pop();
    if (shadow) {
      const targetZone = getZoneState(ctx.state.cards[cardId].zone, ctx.state);
      ctx.state.cards[cardId].shadows.push(shadow);
      ctx.state.cards[shadow].zone = ctx.state.cards[cardId].zone;
      ctx.state.cards[shadow].shadowOf = cardId;
      targetZone.cards.push(shadow);
    }
    return true;
  }

  if (action === 'destroy' || action.destroy) {
    const owner = card.owner;

    ctx.state.next.unshift(
      {
        card: {
          target: card.id,
          action: {
            move: {
              to: !owner
                ? 'discardPile'
                : { type: 'discardPile', player: owner },
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

  if (action.whenRevealed) {
    ctx.state.next.unshift(
      {
        stackPush: {
          type: 'whenRevealed',
          description: action.whenRevealed.description,
          whenRevealed: {
            useCardVar: {
              name: 'self',
              value: card.id,
              action: action.whenRevealed.action,
            },
          },
        },
      },
      'stackPop'
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
    return true;
  }

  if (action.engagePlayer) {
    const player = getTargetPlayer(action.engagePlayer, ctx);
    ctx.state.next.unshift(
      {
        card: {
          target: card.id,
          action: {
            move: {
              from: 'stagingArea',
              to: { player, type: 'engaged' },
            },
          },
        },
      },
      {
        event: {
          type: 'engaged',
          card: card.id,
          player,
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

    return true;
  }

  if (action.dealDamage) {
    const data =
      typeof action.dealDamage === 'number'
        ? { amount: action.dealDamage, attackers: [] }
        : action.dealDamage;

    const amount = calculateNumberExpr(data.amount, ctx);

    card.token.damage += amount;

    const hitpoints = ctx.view.cards[card.id].props.hitPoints;

    if (hitpoints && card.token.damage >= hitpoints) {
      executeCardAction(
        {
          destroy: {
            attackers: data.attackers ?? [],
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

    return true;
  }

  if (action.flip) {
    card.sideUp = action.flip;
    return true;
  }

  if (action.generateResources !== undefined) {
    const amount = calculateNumberExpr(action.generateResources, ctx);
    card.token.resources += amount;
    return;
  }

  if (action.payResources !== undefined) {
    const amount = calculateNumberExpr(action.payResources, ctx);
    card.token.resources -= amount;
    return;
  }

  if (action.move) {
    const moveCtx = card.controller
      ? { ...ctx, player: { ...ctx.player, controller: card.controller } }
      : ctx;

    const fromId = action.move.from
      ? getTargetZoneId(action.move.from, moveCtx)
      : getCardZoneId(card.id, ctx.state);

    if (action.move.from) {
      if (!zonesEqual(card.zone, fromId)) {
        return;
      }
    }

    const sourceZone = getTargetZone(fromId, moveCtx);
    const destinationZone = getTargetZone(action.move.to, moveCtx);

    const sourceInGame = isInGame(getZoneType(fromId));
    const destInGame = isInGame(getZoneType(action.move.to));

    sourceZone.cards = sourceZone.cards.filter((c) => c !== card.id);
    destinationZone.cards.push(card.id);
    card.sideUp = action.move.side ?? card.sideUp;
    const destZoneId = getTargetZoneId(action.move.to, moveCtx);
    card.zone = destZoneId;

    ctx.events.send(
      uiEvent.card_moved({
        cardId: card.id,
        source: fromId,
        destination: destZoneId,
        side: action.move.side ?? card.sideUp,
      })
    );

    if (!sourceInGame && destInGame) {
      ctx.state.next.unshift({ event: { type: 'enteredPlay', card: card.id } });
    }

    if (sourceInGame && !destInGame) {
      card.tapped = false;
      card.mark = {};
      card.token = {
        damage: 0,
        progress: 0,
        resources: 0,
      };

      ctx.state.next.unshift({
        card: { target: card.attachments, action: 'discard' },
      });

      ctx.state.next.unshift({
        card: { target: card.shadows, action: 'discard' },
      });

      ctx.state.modifiers = ctx.state.modifiers.filter(
        (m) => m.source !== card.id
      );

      if (card.attachedTo) {
        const parent = ctx.state.cards[card.attachedTo];
        if (parent) {
          parent.attachments = parent.attachments.filter((a) => a !== card.id);
        }
        card.attachedTo = undefined;
      }

      if (card.shadowOf) {
        const parent = ctx.state.cards[card.shadowOf];
        if (parent) {
          parent.shadows = parent.shadows.filter((a) => a !== card.id);
        }
        card.shadowOf = undefined;
      }

      ctx.state.next.unshift({ event: { type: 'leftPlay', card: card.id } });
    }

    return true;
  }

  if (action.placeProgress !== undefined) {
    if (action.placeProgress === 0) {
      return;
    }

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
      {
        event: {
          type: 'attacks',
          card: card.id,
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
        card: card.id,
        action: 'resolveShadowEffects',
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
              to: card.zone,
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
          source: ctx.state.vars.card.self || 0,
          card: card.id,
          modifier,
          until: action.until,
        });
      }
    } else {
      ctx.state.modifiers.push({
        source: ctx.state.vars.card.self || 0,
        card: card.id,
        modifier: action.modify,
        until: action.until,
      });
    }
    return true;
  }

  if (action.setAsVar) {
    ctx.state.vars.card[action.setAsVar] = card.id;
    return;
  }

  if (action.clear) {
    card.mark[action.clear] = false;
    return;
  }

  if (action.putInPlay) {
    const player = getTargetPlayer(action.putInPlay, ctx);
    ctx.state.next.unshift({
      card: {
        target: card.id,
        action: { move: { to: { player, type: 'playerArea' }, side: 'front' } },
      },
    });
    return;
  }

  if (action.controller && card.controller) {
    const controller = card.controller;
    ctx.state.next.unshift({
      player: controller,
      action: action.controller,
    });
    return;
  }

  if (action.setController) {
    const controller = getTargetPlayer(action.setController, ctx);
    card.controller = controller;
    return;
  }

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}

export function isInGame(zone: ZoneId | ZoneType) {
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
