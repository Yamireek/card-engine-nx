import { CardAction } from '@card-engine-nx/state';
import { CardId } from '@card-engine-nx/basic';
import { isArray } from 'lodash';
import { ViewContext } from '../context';
import { getTargetPlayer } from '../player/target';
import {
  createPayCostAction,
  canPlayerExecute,
  canExecute,
} from '../resolution';
import { isInPlay } from '../utils';
import { getZoneType } from '../zone/target';
import { getTargetCard, getTargetCards } from './target';
import { calculateBoolExpr, calculateNumberExpr } from '../expr';

export function canCardExecute(
  action: CardAction,
  cardId: CardId,
  ctx: ViewContext
): boolean {
  if (isArray(action)) {
    const values = action.map((a) => canCardExecute(a, cardId, ctx));
    return values.every((v) => v);
  }

  const card = ctx.state.cards[cardId];
  const zone = getZoneType(card.zone);
  const inPlay = isInPlay(zone);

  if (typeof action === 'string') {
    if (action === 'moveToBottom' || action === 'moveToTop') {
      return true;
    }

    if (inPlay && action === 'travel') {
      if (ctx.state.zones.activeLocation.cards.length > 0) {
        return false;
      }

      const cv = ctx.view.cards[cardId];
      if (cv.conditional.travel) {
        return calculateBoolExpr({ and: cv.conditional.travel }, ctx);
      }

      return true;
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

    if (zone === 'playerArea' && action === 'discard') {
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

    if (zone === 'playerArea' && action === 'commitToQuest') {
      return !card.tapped;
    }

    return false;
  }

  if (zone === 'playerArea' && action.declareAsDefender) {
    return !card.tapped;
  }

  if (zone === 'playerArea' && action.payResources) {
    const card = ctx.state.cards[cardId];
    const amount = calculateNumberExpr(action.payResources, ctx);
    return card.token.resources >= amount;
  }

  if (zone === 'engaged' && action.resolveEnemyAttacking) {
    return true;
  }

  if (action.mark) {
    return true;
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
    const zone = getZoneType(action.move.to);
    if (!isInPlay(zone)) {
      return true;
    }

    const cv = ctx.view.cards[card.id];
    if (!cv) {
      return false;
    }

    const unique = cv.props.unique;
    if (!unique) {
      return true;
    }

    const exising = getTargetCards(
      {
        simple: 'inAPlay',
        name: cv.props.name ?? '',
      },
      ctx
    );

    return exising.length === 0;
  }

  if (inPlay && action.attachCard) {
    const target = getTargetCard(action.attachCard, ctx);

    const cv = ctx.view.cards[target];
    if (!cv.props.unique) {
      return true;
    }

    const exising = getTargetCards(
      {
        simple: 'inAPlay',
        name: cv.props.name ?? '',
      },
      ctx
    );

    return exising.length === 0;
  }

  if (inPlay && action.modify) {
    return true;
  }

  if (inPlay && action.generateResources) {
    return true;
  }

  if (
    zone === 'engaged' ||
    (zone === 'stagingArea' && action.resolvePlayerAttacking)
  ) {
    return true;
  }

  if (zone === 'hand' && action.payCost) {
    if (!card.controller) {
      return false;
    }

    const payCostAction = createPayCostAction(cardId, action.payCost, ctx);

    if (!payCostAction) {
      return true;
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

  if (action.placeProgress) {
    return inPlay;
  }

  if (action.putInPlay) {
    if (inPlay) {
      return false;
    }

    const cv = ctx.view.cards[card.id];
    if (!cv.props.unique) {
      return true;
    }

    const exising = getTargetCards(
      {
        simple: 'inAPlay',
        name: cv.props.name ?? '',
      },
      ctx
    );

    return exising.length === 0;
  }

  if (action.flip) {
    return true;
  }

  if (action.controller && card.controller) {
    return canPlayerExecute(action.controller, card.controller, ctx);
  }

  if (action.setController) {
    return inPlay;
  }

  if (action.action) {
    return canExecute(action.action, false, ctx);
  }

  return false;
}
