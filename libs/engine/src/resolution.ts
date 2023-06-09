import { Action, CardAction } from '@card-engine-nx/state';
import { ExecutionContext } from './context';
import { getTargetCard } from './card';
import { single } from './utils';
import { sumBy } from 'lodash';
import { CardId } from '@card-engine-nx/basic';

export function canExecute(
  action: Action,
  full: boolean,
  ctx: ExecutionContext
): boolean {
  if (typeof action === 'string') {
    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
    if (action.playAlly) {
      if (ctx.state.phase !== 'planning') {
        return false;
      }

      const cardId = single(getTargetCard(action.playAlly, ctx));
      const owner = ctx.state.cards[cardId].owner;
      if (owner === 'game') {
        return false;
      }

      const player = ctx.state.players[owner];
      if (!player) {
        return false;
      }
      if (!player.zones.hand.cards.includes(cardId)) {
        return false;
      }

      const card = ctx.view.cards[cardId];

      const sphere = card.props.sphere;
      const cost = card.props.cost;

      if (sphere === undefined || cost === undefined) {
        return false;
      }

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
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}

export function canCardExecute(
  action: CardAction,
  cardId: CardId,
  ctx: ExecutionContext
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
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}
