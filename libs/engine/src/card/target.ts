import { CardId, values } from '@card-engine-nx/basic';
import { State, CardTarget, Context, View } from '@card-engine-nx/state';
import { intersection } from 'lodash';

export function getTargetCard(
  target: CardTarget,
  state: State,
  view: View,
  ctx: Context
): CardId[] {
  if (target === 'self') {
    if (ctx.selfCard) {
      return [ctx.selfCard];
    } else {
      throw new Error('no self card in context');
    }
  }

  if (target.and) {
    return intersection(
      target.and.map((t) => getTargetCard(t, state, view, ctx))
    ).flatMap((c) => c);
  }

  if (target.owner) {
    const player = state.players[target.owner];
    if (player) {
      return values(player.zones).flatMap((z) => z.cards);
    } else {
      throw new Error('player not found');
    }
  }

  if (target.type) {
    return values(view.cards)
      .filter((c) => target.type?.includes(c.props.type))
      .map((s) => s.id);
  }

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
