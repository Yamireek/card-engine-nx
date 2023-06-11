import { Action, CardAction, PlayerAction } from '@card-engine-nx/state';
import { ViewContext } from './context';
import { getTargetCard } from './card';
import { sumBy } from 'lodash';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { getTargetPlayer } from './player/target';

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
      const players = getTargetPlayer(playerAction.target, ctx);
      return players.some((p) => canPlayerExecute(playerAction.action, p, ctx));
    }

    if (action.card) {
      const cardAction = action.card;
      const players = getTargetCard(cardAction.taget, ctx);
      return players.some((card) =>
        canCardExecute(cardAction.action, card, ctx)
      );
    }

    if (action.sequence) {
      return action.sequence.every((a) => canExecute(a, false, ctx));
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
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}

export function canPlayerExecute(
  action: PlayerAction,
  playerId: PlayerId,
  ctx: ViewContext
): boolean {
  if (typeof action === 'string') {
    throw new Error(
      `not implemented: canPlayerExecute ${JSON.stringify(action)}`
    );
  } else {
    if (action.chooseCardActions) {
      const targets = getTargetCard(action.chooseCardActions.target, ctx);
      const cardAction = action.chooseCardActions.action;
      return targets.some((id) => canCardExecute(cardAction, id, ctx));
    }

    if (action.payResources) {
      const player = ctx.state.players[playerId];
      if (!player) {
        return false;
      }

      const sphere = action.payResources.sphere;
      const cost = action.payResources.amount;
      const heroes = player.zones.playerArea.cards
        .map((c) => ctx.view.cards[c])
        .filter((c) => c.props.type === 'hero')
        .filter((c) => sphere === 'neutral' || c.props.sphere === sphere);

      const available = sumBy(
        heroes,
        (h) => ctx.state.cards[h.id].token.resources
      );

      return available >= cost;
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
    if (action === 'commitToQuest') {
      return !card.mark.questing && !card.tapped;
    }

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
      return true;
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
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}
