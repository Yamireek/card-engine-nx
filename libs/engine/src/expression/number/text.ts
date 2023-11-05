import { NumberExpr } from '@card-engine-nx/state';

export function getNumberExprText(expr: NumberExpr) {
  return JSON.stringify(expr, null, 1);
}
