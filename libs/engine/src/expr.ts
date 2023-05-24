import { State, NumberExpr, Context } from '@card-engine-nx/state';
import { getTargetCard } from './card/target';
import { calculateCardExpr } from './card/expr';
import { sum } from 'lodash';

export function calculateExpr(
  expr: NumberExpr,
  state: State,
  ctx: Context
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr.fromCard) {
    const ids = getTargetCard(expr.fromCard.card, state, ctx);
    if (ids.length === 1) {
      return calculateCardExpr(expr.fromCard.value, state, ids[0]);
    } else {
      if (expr.fromCard.sum) {
        return sum(
          ids.map((id) =>
            calculateCardExpr(expr.fromCard?.value || 0, state, id)
          )
        );
      } else {
        throw new Error('multiple card');
      }
    }
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
