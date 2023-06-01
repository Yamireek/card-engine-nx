import { CardId } from '@card-engine-nx/basic';
import { State, CardNumberExpr, View } from '@card-engine-nx/state';

export function calculateCardExpr(
  expr: CardNumberExpr,
  state: State,
  view: View,
  cardId: CardId
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'threadCost') {
    return view.cards[cardId].props.threatCost || 0;
  }

  if (expr.tokens) {
    return state.cards[cardId].token[expr.tokens];
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
