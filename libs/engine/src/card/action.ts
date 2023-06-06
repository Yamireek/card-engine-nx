import { CardState, CardAction } from '@card-engine-nx/state';

export function executeCardAction(action: CardAction, card: CardState) {
  if (action === 'empty') {
    return;
  }

  if (action === 'ready') {
    card.tapped = false;
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

  throw new Error(`unknown card action: ${JSON.stringify(action)}`);
}
