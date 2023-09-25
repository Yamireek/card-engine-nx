import { Action, CardAction, PlayerAction } from '@card-engine-nx/state';
import { ViewContext } from './context';
import { getTargetCards } from './card';
import { sumBy } from 'lodash';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { getTargetPlayers } from './player/target';

export function canExecute(
  action: Action,
  payment: boolean,
  ctx: ViewContext
): boolean {
  if (typeof action === 'string') {
    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
    if (action.player) {
      const playerAction = action.player;
      const players = getTargetPlayers(playerAction.target, ctx);
      return players.some((p) => canPlayerExecute(playerAction.action, p, ctx));
    }

    if (action.card) {
      const cardAction = action.card;
      const cards = getTargetCards(cardAction.taget, ctx);
      return cards.some((card) => canCardExecute(cardAction.action, card, ctx));
    }

    if (action.sequence) {
      return action.sequence.every((a) => canExecute(a, payment, ctx));
    }

    if (action.setCardVar) {
      return true;
    }

    if (action.setPlayerVar) {
      return true;
    }

    if (action.payment) {
      const payment = canExecute(action.payment.cost, true, ctx);
      const effect = canExecute(action.payment.effect, false, ctx);
      return payment && effect;
    }

    if (action.useLimit) {
      const existing = ctx.state.actionLimits.some(
        (u) =>
          u.card === action.useLimit?.card && u.index === action.useLimit.index
      );

      return !existing;
    }

    if (action.resolveAttack) {
      return true;
    }
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}

export function canPlayerExecute(
  action: PlayerAction,
  playerId: PlayerId,
  ctx: ViewContext
): boolean {
  const player = ctx.state.players[playerId];
  if (!player || player.eliminated) {
    return false;
  }

  if (typeof action === 'string') {
    throw new Error(
      `not implemented: canPlayerExecute ${JSON.stringify(action)}`
    );
  } else {
    if (action.chooseCardActions) {
      const targets = getTargetCards(action.chooseCardActions.target, ctx);
      const cardAction = action.chooseCardActions.action;
      return targets.some((id) => canCardExecute(cardAction, id, ctx));
    }

    if (action.choosePlayerActions) {
      const targets = getTargetPlayers(action.choosePlayerActions.target, ctx);
      const playerAction = action.choosePlayerActions.action;
      return targets.some((id) => canPlayerExecute(playerAction, id, ctx));
    }

    if (action.payResources) {
      const sphere = action.payResources.sphere;
      const cost = action.payResources.amount;
      const heroes = player.zones.playerArea.cards
        .map((c) => ctx.view.cards[c])
        .filter((c) => c.props.type === 'hero')
        .filter((c) => sphere === 'neutral' || c.props.sphere === sphere)
        .filter((c) => ctx.state.cards[c.id].token.resources > 0);

      if (
        action.payResources.heroes &&
        heroes.length < action.payResources.heroes
      ) {
        return false;
      }

      const available = sumBy(
        heroes,
        (h) => ctx.state.cards[h.id].token.resources
      );

      return available >= cost;
    }

    if (action.draw) {
      return player.zones.library.cards.length > 0;
    }

    if (action.discard) {
      return player.zones.hand.cards.length >= action.discard;
    }

    if (action.sequence) {
      return action.sequence.every((a) => canPlayerExecute(a, playerId, ctx));
    }

    if (action.setLimit) {
      return !player.limits[action.setLimit.key];
    }

    if (action.engaged) {
      const cardAction = action.engaged;
      return player.zones.engaged.cards.some((c) =>
        canCardExecute(cardAction, c, ctx)
      );
    }

    throw new Error(
      `not implemented: canPlayerExecute ${JSON.stringify(action)}`
    );
  }
}

export function canCardExecute(
  action: CardAction,
  cardId: CardId,
  ctx: ViewContext
): boolean {
  const card = ctx.state.cards[cardId];

  if (typeof action === 'string') {
    if (action === 'travel') {
      return ctx.state.zones.activeLocation.cards.length === 0;
    }

    if (action === 'exhaust') {
      return !card.tapped;
    }

    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
    if (action.payResources) {
      const card = ctx.state.cards[cardId];
      return card.token.resources >= action.payResources;
    }

    if (action.engagePlayer) {
      return true;
    }

    if (action.resolveEnemyAttacking) {
      return true;
    }

    if (action.sequence) {
      return action.sequence.every((a) => canCardExecute(a, cardId, ctx));
    }

    if (action.mark) {
      const disabled = ctx.view.cards[cardId].disabled?.[action.mark];
      return !disabled;
    }

    if (action.dealDamage) {
      return true;
    }

    if (action.heal) {
      return card.token.damage > 0;
    }

    if (action.move) {
      return true;
    }

    if (action.attachCard) {
      return true;
    }

    if (action.modify) {
      return true;
    }

    if (action.setCardVar) {
      return true;
    }
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}
