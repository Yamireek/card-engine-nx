import { State, NumberExpr, Context, View } from '@card-engine-nx/state';
import { getTargetCard } from './card/target';
import { calculateCardExpr } from './card/expr';
import { sum } from 'lodash';

export function calculateExpr(
  expr: NumberExpr,
  state: State,
  view: View,
  ctx: Context
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr.fromCard) {
    const ids = getTargetCard(expr.fromCard.card, state, view, ctx);
    if (ids.length === 1) {
      return calculateCardExpr(expr.fromCard.value, state, view, ids[0]);
    } else {
      if (expr.fromCard.sum) {
        return sum(
          ids.map((id) =>
            calculateCardExpr(expr.fromCard?.value || 0, state, view, id)
          )
        );
      } else {
        throw new Error('multiple card');
      }
    }
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
