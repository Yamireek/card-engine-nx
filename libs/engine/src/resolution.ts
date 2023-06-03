import { Action } from '@card-engine-nx/state';
import { ExecutionContext } from './action';
import { getTargetCard } from './card';
import { single } from './utils';
import { sumBy } from 'lodash';

export function canExecute(
  action: Action,
  full: boolean,
  ctx: ExecutionContext
): boolean {
  if (typeof action === 'string') {
    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
    if (action.playAlly) {
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
