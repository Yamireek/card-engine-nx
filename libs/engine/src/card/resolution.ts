import { CardAction } from '@card-engine-nx/state';
import { CardId, getZoneType } from '@card-engine-nx/basic';
import { isArray } from 'lodash';
import { ViewContext } from '../context';
import { getTargetPlayer } from '../player/target';
import { createPayCostAction, canPlayerExecute } from '../resolution';
import { isInPlay } from '../utils';

export function canCardExecute(
  action: CardAction,
  cardId: CardId,
  ctx: ViewContext
): boolean {
  if (isArray(action)) {
    return action.every((a) => canCardExecute(a, cardId, ctx));
  }

  const card = ctx.state.cards[cardId];
  const zone = getZoneType(card.zone);
  const inPlay = isInPlay(zone);

  if (typeof action === 'string') {
    if (inPlay && action === 'travel') {
      return ctx.state.zones.activeLocation.cards.length === 0;
    }

    if (inPlay && action === 'exhaust') {
      return !card.tapped && zone === 'playerArea';
    }

    if (inPlay && action === 'ready') {
      return card.tapped;
    }

    if (zone === 'hand' && action === 'discard') {
      return true;
    }

    if (zone === 'encounterDeck' && action === 'discard') {
      return true;
    }

    if (zone === 'encounterDeck' && action === 'reveal') {
      return true;
    }

    if (zone === 'library' && action === 'draw') {
      if (!card.owner) {
        return false;
      }

      const owner = ctx.view.players[card.owner];
      return zone === 'library' && !owner?.disableDraw;
    }

    return false;
  }

  if (zone === 'playerArea' && action.declareAsDefender) {
    return !card.tapped;
  }

  if (zone === 'playerArea' && action.payResources) {
    const card = ctx.state.cards[cardId];
    return card.token.resources >= action.payResources;
  }

  if (zone === 'engaged' && action.resolveEnemyAttacking) {
    return true;
  }

  if (inPlay && action.mark) {
    const disabled = ctx.view.cards[cardId].disabled?.[action.mark];
    return !disabled;
  }

  if (action.clear) {
    return true;
  }

  if (inPlay && action.dealDamage) {
    return true;
  }

  if (
    zone === 'encounterDeck' &&
    card.sideUp === 'front' &&
    action.dealDamage
  ) {
    return true;
  }

  if (zone === 'playerArea' && action.heal) {
    return card.token.damage > 0;
  }

  if (action.move) {
    return true;
  }

  if (inPlay && action.attachCard) {
    return true;
  }

  if (inPlay && action.modify) {
    return true;
  }

  if (action.setAsVar) {
    return true;
  }

  if (inPlay && action.generateResources) {
    return true;
  }

  if (zone === 'engaged' && action.resolvePlayerAttacking) {
    return true;
  }

  if (zone === 'hand' && action.payCost) {
    if (!card.controller) {
      return false;
    }

    const payCostAction = createPayCostAction(cardId, action.payCost, ctx);

    if (!payCostAction) {
      return false;
    }

    return canPlayerExecute(payCostAction, card.controller, ctx);
  }

  if (zone === 'stagingArea' && action.engagePlayer) {
    return true;
  }

  if (action.engagePlayer) {
    if (card.zone === 'stagingArea') {
      return true;
    }

    if (typeof card.zone === 'string') {
      return false;
    }

    const player = getTargetPlayer(action.engagePlayer, ctx);
    return card.zone.player !== player;
  }

  if (inPlay && action.placeProgress) {
    return true;
  }

  return false;
}
