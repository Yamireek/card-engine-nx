import { CardId } from '@card-engine-nx/basic';
import { CardNumberExpr } from '@card-engine-nx/state';
import { ExecutionContext } from "../context";

export function calculateCardExpr(
  expr: CardNumberExpr,
  cardId: CardId,
  ctx: ExecutionContext
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'threadCost') {
    return ctx.view.cards[cardId].props.threatCost || 0;
  }

  if (expr.tokens) {
    return ctx.state.cards[cardId].token[expr.tokens];
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
