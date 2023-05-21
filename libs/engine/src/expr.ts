import { State, NumberExpr, Context } from '@card-engine-nx/state';
import { getTargetedCard } from './card/target';
import { calculateCardExpr } from './card/expr';

export function calculateExpr(
  expr: NumberExpr,
  state: State,
  ctx: Context
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr.fromCard) {
    const ids = getTargetedCard(expr.fromCard.card, state, ctx);
    if (ids.length === 1) {
      return calculateCardExpr(expr.fromCard.value, state, ids[0]);
    } else {
      throw new Error('multiple card');
    }
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
