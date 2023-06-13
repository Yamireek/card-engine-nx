import { CardId } from '@card-engine-nx/basic';
import { CardNumberExpr } from '@card-engine-nx/state';
import { ViewContext } from '../context';

export function calculateCardExpr(
  expr: CardNumberExpr,
  cardId: CardId,
  ctx: ViewContext
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'threadCost') {
    return ctx.view.cards[cardId].props.threatCost || 0;
  }

  if (expr === 'willpower') {
    return ctx.view.cards[cardId].props.willpower || 0;
  }

  if (expr === 'threat') {
    return ctx.view.cards[cardId].props.threat || 0;
  }

  if (expr === 'sequence') {
    return ctx.view.cards[cardId].props.sequence || 0;
  }

  if (expr.tokens) {
    return ctx.state.cards[cardId].token[expr.tokens];
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
