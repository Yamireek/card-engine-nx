import { CardId } from '@card-engine-nx/basic';
import { CardBoolExpr } from '@card-engine-nx/state';
import { ViewContext } from '../../../context/view';
import { calculateBoolExpr } from '../../../expression/bool/calculate';
import { getZoneType, isInPlay } from '../../../zone/utils';
import { checkCardPredicate } from '../../predicate/check';
import { getTargetCard } from '../../target/single';

export function calculateCardBoolExpr(
  expr: CardBoolExpr,
  cardId: CardId,
  ctx: ViewContext
): boolean {
  if (typeof expr === 'boolean') {
    return expr;
  }

  if (expr === 'in_a_play') {
    const zone = ctx.state.cards[cardId].zone;
    return isInPlay(getZoneType(zone));
  }

  if (expr.hasTrait) {
    const traits = ctx.view.cards[cardId].props.traits;
    return traits?.includes(expr.hasTrait) ?? false;
  }

  if (expr.hasMark) {
    const mark = ctx.state.cards[cardId].mark;
    return mark[expr.hasMark];
  }

  if (expr.is) {
    const target = getTargetCard(expr.is, ctx);
    return target === cardId;
  }

  if (expr.isType) {
    const type = ctx.view.cards[cardId].props.type;

    if (expr.isType === 'character' && (type === 'ally' || type === 'hero')) {
      return true;
    } else {
      return expr.isType === type;
    }
  }

  if (expr.name) {
    return ctx.view.cards[cardId].props.name === expr.name;
  }

  if (expr.zone) {
    return ctx.state.cards[cardId].zone === expr.zone;
  }

  if (expr.and) {
    return expr.and.every((e) => calculateCardBoolExpr(e, cardId, ctx));
  }

  if (expr.global) {
    return calculateBoolExpr(expr.global, ctx);
  }

  if (expr.predicate) {
    return checkCardPredicate(
      expr.predicate,
      ctx.state.cards[cardId],
      ctx.view.cards[cardId],
      ctx
    );
  }

  throw new Error(`unknown card bool expression: ${JSON.stringify(expr)}`);
}
