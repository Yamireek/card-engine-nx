import { BoolExpr, NumberExpr } from '@card-engine-nx/state';
import { getTargetCard } from './card/target';
import { calculateCardExpr } from './card/expr';
import { sum } from 'lodash';
import { ExecutionContext } from './context';

export function calculateNumberExpr(
  expr: NumberExpr,
  ctx: ExecutionContext
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'countOfPlayers') {
    return Object.keys(ctx.state.players).length;
  }

  if (expr.fromCard) {
    const ids = getTargetCard(expr.fromCard.card, ctx);
    if (ids.length === 1) {
      return calculateCardExpr(expr.fromCard.value, ids[0], ctx);
    } else {
      if (expr.fromCard.sum) {
        return sum(
          ids.map((id) => calculateCardExpr(expr.fromCard?.value || 0, id, ctx))
        );
      } else {
        throw new Error('multiple card');
      }
    }
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}

export function calculateBoolExpr(
  expr: BoolExpr,
  ctx: ExecutionContext
): boolean {
  if (typeof expr === 'boolean') {
    return expr;
  }

  if (expr === 'enemiesToEngage') {
    throw new Error('not implemented');
  }

  if (expr.phase) {
    return ctx.state.phase === expr.phase;
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
