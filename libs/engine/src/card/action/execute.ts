import { CardState, CardAction, Action, Scope } from '@card-engine-nx/state';
import { updatedScopes } from '../../context/update';
import { ExecutionContext } from '../../context/execution';
import { uiEvent } from '../../events/eventFactories';
import {
  getCardZoneId,
  getTargetZoneId,
  getZoneState,
  getZoneType,
} from '../../zone/utils';
import { getTargetZone } from '../../zone/target/single';
import { calculateBoolExpr } from '../../expression/bool/calculate';
import { calculateNumberExpr } from '../../expression/number/calculate';
import { isArray } from 'lodash';
import { zonesEqual } from '@card-engine-nx/basic';
import { getTargetCards } from '../target/multi';
import { getTargetCard } from '../target/single';
import { createPayCostAction } from './payCost';
import { getTargetPlayer } from '../../player/target/single';
import { executeAction } from '../../action/execute';
import { isInGame } from '../../zone/utils';

export function executeCardAction(
  action: CardAction,
  card: CardState,
  ctx: ExecutionContext,
  scopes: Scope[]
) {
  if (isArray(action)) {
    const actions: Action[] = action.map((a) => ({
      card: card.id,
      action: a,
    }));

    ctx.next(...actions);
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
    const travelCost = ctx.view.cards[card.id].rules.travel ?? [];
    ctx.next(
      ...travelCost,
      {
        card: card.id,
        action: {
          move: {
            from: 'stagingArea',
            to: 'activeLocation',
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
      ctx.next({
        card: card.id,
        action: [{ flip: 'front' }, 'reveal'],
      });
      return;
    }

    const props = ctx.view.cards[card.id].props;

    ctx.next(
      { event: { type: 'revealed', card: card.id } },
      {
        card: card.id,
        action: {
          move: {
            from: 'encounterDeck',
            to: props.type === 'treachery' ? 'discardPile' : 'stagingArea',
          },
        },
      }
    );

    return;
  }

  if (action === 'shuffleToDeck') {
    if (card.owner) {
      ctx.next(
        {
          card: card.id,
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
        {
          player: card.owner,
          action: 'shuffleLibrary',
        }
      );
    }

    return;
  }

  if (action === 'discard') {
    const owner = card.owner;

    ctx.next({
      card: card.id,
      action: {
        move: {
          to: !owner ? 'discardPile' : { type: 'discardPile', player: owner },
          side: 'front',
        },
      },
    });
    return;
  }

  if (action === 'advance') {
    const quest = ctx.view.cards[card.id];

    card.token.progress = 0;

    const removedExplored: Action = {
      card: card.id,
      action: {
        move: {
          from: 'questArea',
          to: 'removed',
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
      ctx,
      scopes
    );

    if (next.length === 0) {
      ctx.next('win');
      return;
    }

    const nextId = next.length === 1 ? next[0] : ctx.random.item(next);

    ctx.next(
      removedExplored,
      {
        choice: {
          id: ctx.state.nextId++,
          type: 'show',
          title: 'Next quest card',
          cardId: nextId,
        },
      },
      {
        card: nextId,
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
      {
        event: {
          type: 'revealed',
          card: nextId,
        },
      }
    );

    return;
  }

  if (action === 'draw') {
    const owner = card.owner;

    if (!owner) {
      throw new Error("can't draw card without owner");
    }

    const ow = ctx.view.players[owner];
    if (ow?.rules.disableDraw) {
      return;
    }

    ctx.next({
      card: card.id,
      action: {
        move: {
          to: { type: 'hand', player: owner },
          side: 'front',
        },
      },
    });
    return;
  }

  if (action === 'explore') {
    ctx.next(
      {
        event: {
          type: 'explored',
          card: card.id,
        },
      },
      {
        card: card.id,
        action: {
          move: {
            to: 'discardPile',
          },
        },
      }
    );
    return;
  }

  if (action === 'commitToQuest') {
    ctx.next({
      card: card.id,
      action: ['exhaust', { mark: 'questing' }],
    });
    return;
  }

  if (action === 'resolveShadowEffects') {
    const cards = ctx.state.cards[card.id].shadows.flatMap(
      (id) => ctx.view.cards[id]
    );

    if (cards.length > 0) {
      ctx.next(
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
    const shadows = ctx.view.cards[card.id].rules.shadows ?? [];

    if (shadows.length > 0) {
      for (const shadow of shadows) {
        ctx.next(
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
                useScope: {
                  var: 'self',
                  card: card.id,
                },
                action: shadow.action,
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
    return;
  }

  if (action === 'destroy' || action.destroy) {
    const owner = card.owner;

    ctx.next(
      {
        card: card.id,
        action: {
          move: {
            to: !owner ? 'discardPile' : { type: 'discardPile', player: owner },
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
    ctx.next(
      {
        stackPush: {
          type: 'whenRevealed',
          description: action.whenRevealed.description,
          whenRevealed: {
            useScope: {
              var: 'self',
              card: card.id,
            },
            action: action.whenRevealed.action,
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
      ctx.next({
        player: controller,
        action: payCostAction,
      });
    }
    return;
  }

  if (action.ready === 'refresh') {
    const cv = ctx.view.cards[card.id];
    const cost = cv.rules.refreshCost ?? [];
    const free = cost.length === 0;
    if (free) {
      ctx.next({ card: card.id, action: 'ready' });
    } else {
      if (card.controller) {
        ctx.next({
          player: card.controller,
          action: {
            chooseActions: {
              title: 'Pay for refresh?',
              actions: [
                {
                  title: 'Yes',
                  action: {
                    card: card.id,
                    action: [...cost, 'ready'],
                  },
                },
              ],
              optional: true,
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
    ctx.next({
      event: {
        type: 'declaredAsDefender',
        card: card.id,
        attacker: action.declareAsDefender.attacker,
      },
    });
    return;
  }

  if (action.engagePlayer) {
    const player = getTargetPlayer(action.engagePlayer, ctx, scopes);
    ctx.next(
      {
        card: card.id,
        action: {
          move: {
            from: 'stagingArea',
            to: { player, type: 'engaged' },
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

    return;
  }

  if (action.dealDamage) {
    const data =
      typeof action.dealDamage === 'number'
        ? { amount: action.dealDamage, attackers: [] }
        : action.dealDamage;

    const amount = calculateNumberExpr(data.amount, ctx, scopes);

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
        ctx,
        scopes
      );
    }

    ctx.next({
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

  if (action.generateResources !== undefined) {
    const amount = calculateNumberExpr(action.generateResources, ctx, scopes);
    card.token.resources += amount;
    return;
  }

  if (action.payResources !== undefined) {
    const amount = calculateNumberExpr(action.payResources, ctx, scopes);
    card.token.resources -= amount;
    return;
  }

  if (action.move) {
    const moveScope = card.controller
      ? updatedScopes(ctx, scopes, {
          var: 'controller',
          player: card.controller,
        })
      : scopes;

    const fromId = action.move.from
      ? getTargetZoneId(action.move.from, ctx, moveScope)
      : getCardZoneId(card.id, ctx.state);

    if (action.move.from) {
      if (!zonesEqual(card.zone, fromId)) {
        return;
      }
    }

    const sourceZone = getTargetZone(fromId, ctx, moveScope);
    const destinationZone = getTargetZone(action.move.to, ctx, moveScope);

    const sourceInGame = isInGame(getZoneType(fromId));
    const destInGame = isInGame(getZoneType(action.move.to));

    sourceZone.cards = sourceZone.cards.filter((c) => c !== card.id);
    destinationZone.cards.push(card.id);
    card.sideUp = action.move.side ?? card.sideUp;
    const destZoneId = getTargetZoneId(action.move.to, ctx, moveScope);
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
      ctx.next({ event: { type: 'enteredPlay', card: card.id } });
    }

    if (sourceInGame && !destInGame) {
      card.tapped = false;
      card.mark = {};
      card.token = {
        damage: 0,
        progress: 0,
        resources: 0,
      };

      ctx.next({
        card: card.attachments,
        action: 'discard',
      });

      ctx.next({
        card: card.shadows,
        action: 'discard',
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

      ctx.next({ event: { type: 'leftPlay', card: card.id } });
    }

    return;
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
        const expr = cw.rules.conditional?.advance ?? [];
        const allowed =
          expr.length > 0
            ? calculateBoolExpr({ and: expr }, ctx, scopes)
            : true;

        if (allowed) {
          executeCardAction('advance', card, ctx, scopes);
        }
      }
    }

    if (cw.props.type === 'location') {
      const qp = cw.props.questPoints;
      if (qp && card.token.progress >= qp) {
        executeCardAction('explore', card, ctx, scopes);
      }
    }

    return;
  }

  if (action.resolveEnemyAttacking) {
    ctx.next(
      {
        card: card.id,
        action: { mark: 'attacking' },
      },
      {
        event: {
          type: 'attacks',
          card: card.id,
        },
      },
      { playerActions: 'Declare defender' },
      {
        player: action.resolveEnemyAttacking,
        action: 'declareDefender',
      },
      {
        card: card.id,
        action: 'resolveShadowEffects',
      },
      {
        player: action.resolveEnemyAttacking,
        action: 'determineCombatDamage',
      },
      { clearMarks: 'attacking' },
      { clearMarks: 'defending' },
      {
        card: card.id,
        action: { mark: 'attacked' },
      }
    );
    return;
  }

  if (action.resolvePlayerAttacking) {
    const enemy = card.id;
    ctx.next(
      { card: enemy, action: { mark: 'defending' } },
      { playerActions: 'Declare attackers' },
      {
        player: action.resolvePlayerAttacking,
        action: {
          declareAttackers: enemy,
        },
      },
      { playerActions: 'Determine combat damage' },
      {
        player: action.resolvePlayerAttacking,
        action: 'determineCombatDamage',
      },
      { clearMarks: 'attacking' },
      { clearMarks: 'defending' },
      { card: enemy, action: { mark: 'attacked' } }
    );
    return;
  }

  if (action.mark) {
    card.mark[action.mark] = true;
    return;
  }

  if (action.attachCard) {
    const target = getTargetCard(action.attachCard, ctx, scopes);
    if (target) {
      card.attachments.push(target);
      ctx.state.cards[target].attachedTo = card.id;
      ctx.next({
        card: target,
        action: {
          move: {
            side: 'front',
            to: card.zone,
          },
        },
      });
    }
    return;
  }

  if (action.modify) {
    const source = getTargetCard({ var: 'self' }, ctx, scopes);
    if (isArray(action.modify)) {
      for (const modifier of action.modify) {
        ctx.state.modifiers.push({
          source,
          card: card.id,
          modifier,
          until: action.until,
        });
      }
    } else {
      ctx.state.modifiers.push({
        source,
        card: card.id,
        modifier: action.modify,
        until: action.until,
      });
    }
    return;
  }

  if (action.clear) {
    card.mark[action.clear] = false;
    return;
  }

  if (action.putInPlay) {
    const player = getTargetPlayer(action.putInPlay, ctx, scopes);
    ctx.next({
      card: card.id,
      action: { move: { to: { player, type: 'playerArea' }, side: 'front' } },
    });
    return;
  }

  if (action.controller && card.controller) {
    const controller = card.controller;
    ctx.next({
      player: controller,
      action: action.controller,
    });
    return;
  }

  if (action.setController) {
    const controller = getTargetPlayer(action.setController, ctx, scopes);
    card.controller = controller;
    return;
  }

  if (action.action) {
    executeAction(action.action, ctx, scopes);
    return;
  }

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}
