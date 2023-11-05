import { CardId } from '@card-engine-nx/basic';
import { CardTarget } from '@card-engine-nx/state';
import { last } from 'lodash';
import { cardIds } from '../../context/utils';
import { ViewContext } from '../../context/view';
import { getTargetZones } from '../../zone/target/multi';
import { isArray, takeRight } from 'lodash/fp';
import { calculateNumberExpr } from '../../expression/number/calculate';
import { getCardFromScope } from '../../scope/getCard';
import { checkCardPredicate } from '../predicate/check';

export function getTargetCards(target: CardTarget, ctx: ViewContext): CardId[] {
  if (typeof target === 'number') {
    return [target];
  }

  if (isArray(target)) {
    return target;
  }

  if (target === 'each') {
    return cardIds(ctx);
  }

  if (typeof target !== 'string' && target.top) {
    if (typeof target.top !== 'string' && 'amount' in target.top) {
      const zones = getTargetZones(target.top.zone, ctx);
      if (zones.length === 1) {
        const cards = zones[0].cards;
        const predicate = target.top.filter;
        const filtered = predicate
          ? cards.filter((c) =>
              checkCardPredicate(
                predicate,
                ctx.state.cards[c],
                ctx.view.cards[c],
                ctx
              )
            )
          : cards;
        const amount = calculateNumberExpr(target.top.amount, ctx);
        return takeRight(amount)(filtered);
      } else {
        throw new Error('need only 1 zone when using amount');
      }
    }

    const zones = getTargetZones(target.top, ctx);
    return zones.flatMap((z) => last(z.cards) ?? []);
  }

  if (typeof target !== 'string' && target.take) {
    const all = getTargetCards({ ...target, take: undefined }, ctx);
    return all.slice(0, target.take);
  }

  if (typeof target !== 'string' && target.var) {
    const inScope = getCardFromScope(ctx, target.var);
    if (inScope) {
      return inScope;
    }

    return [];
  }

  return cardIds(ctx).flatMap((id) => {
    const state = ctx.state.cards[id];
    const view = ctx.view.cards[id];

    if (!state || !view) {
      return [];
    }

    const checked = checkCardPredicate(target, state, view, ctx);
    return checked ? id : [];
  });

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
