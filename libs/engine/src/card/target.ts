import { CardId, values } from '@card-engine-nx/basic';
import { CardTarget } from '@card-engine-nx/state';
import { intersection, last } from 'lodash';
import { ExecutionContext } from '../action';
import { getTargetZone } from '../zone/target';

export function getTargetCard(
  target: CardTarget,
  ctx: ExecutionContext
): CardId[] {
  if (target === 'self') {
    if (ctx.card['self']) {
      return [ctx.card['self']];
    } else {
      throw new Error('no self card in context');
    }
  }

  if (target.and) {
    return intersection(target.and.map((t) => getTargetCard(t, ctx))).flatMap(
      (c) => c
    );
  }

  if (target.owner) {
    const player = ctx.state.players[target.owner];
    if (player) {
      return values(player.zones).flatMap((z) => z.cards);
    } else {
      throw new Error('player not found');
    }
  }

  if (target.type) {
    return values(ctx.view.cards)
      .filter((c) => target.type?.includes(c.props.type))
      .map((s) => s.id);
  }

  if (target.top) {
    const zones = getTargetZone(target.top, ctx.state);
    return zones.flatMap((z) => last(z.cards) ?? []);
  }

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
