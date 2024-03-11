import { CardId } from '@card-engine-nx/basic';
import { CardNumberExpr } from '@card-engine-nx/state';
import { ViewContext } from '../../../context/view';

export function calculateCardExpr(
  expr: CardNumberExpr,
  cardId: CardId,
  ctx: ViewContext
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'threadCost') {
    return ctx.state.cards[cardId].view.props.threatCost || 0;
  }

  if (expr === 'willpower') {
    return ctx.state.cards[cardId].view.props.willpower || 0;
  }

  if (expr === 'threat') {
    return ctx.state.cards[cardId].view.props.threat || 0;
  }

  if (expr === 'sequence') {
    return ctx.state.cards[cardId].view.props.sequence || 0;
  }

  if (expr === 'cost') {
    const cost = ctx.state.cards[cardId].view.props.cost;
    return typeof cost === 'number' ? cost : 0;
  }

  if (expr.tokens) {
    return ctx.state.cards[cardId].token[expr.tokens];
  }

  throw new Error(`unknown card number expression: ${JSON.stringify(expr)}`);
}
