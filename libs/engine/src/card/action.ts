import { CardState, CardAction, Action, Event } from '@card-engine-nx/state';
import { ExecutionContext } from '../context';
import { uiEvent } from '../eventFactories';
import { getCardZoneId, getZoneState } from '../zone/target';
import { sequence } from '../utils/sequence';
import { calculateNumberExpr } from '../expr';
import { isArray } from 'lodash';
import { processReponses } from './reponses';

export function executeCardAction(
  action: CardAction,
  card: CardState,
  ctx: ExecutionContext
) {
  if (action === 'empty') {
    return;
  }

  if (action === 'ready') {
    card.tapped = false;
    return;
  }

  if (action === 'travel') {
    ctx.state.next.unshift({
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
    });
    return;
  }

  if (action === 'exhaust') {
    card.tapped = true;
    return;
  }

  if (action === 'reveal') {
    // TODO when revealed effects

    if (card.sideUp === 'back') {
      ctx.state.next.unshift({
        card: {
          target: card.id,
          action: {
            sequence: [{ flip: 'front' }, 'reveal'],
          },
        },
      });
      return;
    }

    const props = ctx.view.cards[card.id].props;

    processReponses({ type: 'revealed', card: card.id }, ctx);

    ctx.state.next.unshift({
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
    });

    return;
  }

  if (action === 'shuffleToDeck') {
    if (card.owner) {
      ctx.state.next.unshift({
        sequence: [
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
          },
        ],
      });
    }

    return;
  }

  if (action === 'destroy' || action.destroy) {
    card.token = { damage: 0, progress: 0, resources: 0 };
    card.mark = {
      attacked: false,
      attacking: false,
      defending: false,
      questing: false,
    };
    card.tapped = false;

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

    processReponses(
      {
        type: 'destroyed',
        card: card.id,
        attackers: action === 'destroy' ? [] : action.destroy?.attackers ?? [],
      },
      ctx
    );

    return;
  }

  if (action.engagePlayer) {
    ctx.state.next.unshift({
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
    });
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

    const event: Event = {
      type: 'receivedDamage',
      card: card.id,
      damage: amount,
    };

    processReponses(event, ctx);

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
    const fromId = action.move.from ?? getCardZoneId(card.id, ctx.state);
    const sourceZone = getZoneState(fromId, ctx.state);
    const destinationZone = getZoneState(action.move.to, ctx.state);

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
    return;
  }

  if (action.placeProgress) {
    card.token.progress += action.placeProgress;
    return;
  }

  if (action.resolveEnemyAttacking) {
    ctx.state.next.unshift(
      sequence(
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
      )
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

  if (action.sequence) {
    const actions: Action[] = action.sequence.map((a) => ({
      card: { target: card.id, action: a },
    }));

    ctx.state.next.unshift(...actions);
    return;
  }

  if (action.attachCard) {
    card.attachments.push(action.attachCard);
    ctx.state.cards[action.attachCard].attachedTo = card.id;
    return;
  }

  if (action.modify) {
    if (isArray(action.modify)) {
      for (const modifier of action.modify) {
        ctx.state.modifiers.push({
          card: card.id,
          modifier,
          until: modifier.until,
        });
      }
    } else {
      ctx.state.modifiers.push({
        card: card.id,
        modifier: action.modify,
        until: action.modify.until,
      });
    }
    return;
  }

  if (action.setAsVar) {
    ctx.state.vars.card[action.setAsVar] = card.id;
    return;
  }

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}
