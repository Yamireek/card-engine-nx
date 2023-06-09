import { CardState, CardAction } from '@card-engine-nx/state';
import { ExecutionContext } from '../context';
import { uiEvent } from '../eventFactories';
import { getZoneState } from '../zone/target';

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

  if (action === 'commitToQuest') {
    card.tapped = true;
    card.mark.questing = true;
    return;
  }

  if (action === 'travel') {
    ctx.state.next.unshift({
      card: {
        taget: card.id,
        action: {
          move: {
            from: { owner: 'game', type: 'stagingArea' },
            to: { owner: 'game', type: 'activeLocation' },
            side: 'front',
          },
        },
      },
    });
    return;
  }

  if (action.engagePlayer) {
    ctx.state.next.unshift({
      card: {
        taget: card.id,
        action: {
          move: {
            from: { owner: 'game', type: 'stagingArea' },
            to: { owner: action.engagePlayer, type: 'engaged' },
            side: 'front',
          },
        },
      },
    });
    return;
  }

  if (action.heal) {
    card.token.damage = Math.max(0, card.token.damage - action.heal);
    return;
  }

  if (action.dealDamage) {
    card.token.damage += action.dealDamage;
    return;
  }

  if (action.flip) {
    card.sideUp = action.flip;
    return;
  }

  if (action.generateResources) {
    card.token.resources += action.generateResources;
    return;
  }

  if (action.payResources) {
    card.token.resources -= action.payResources;
    return;
  }

  if (action.move) {
    const sourceZone = getZoneState(action.move.from, ctx.state);
    const destinationZone = getZoneState(action.move.to, ctx.state);

    sourceZone.cards = sourceZone.cards.filter((c) => c !== card.id);
    destinationZone.cards.push(card.id);
    card.sideUp = action.move.side;

    ctx.events.send(
      uiEvent.card_moved({
        cardId: card.id,
        source: action.move.from,
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

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}
