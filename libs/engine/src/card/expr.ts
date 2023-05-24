import { CardId } from '@card-engine-nx/basic';
import { State, CardNumberExpr } from '@card-engine-nx/state';
import { createView } from '../view';

export function calculateCardExpr(
  expr: CardNumberExpr,
  state: State,
  cardId: CardId
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'threadCost') {
    const view = createView(state);
    return view.cards[cardId].props.threatCost || 0;
  }

  if (expr.tokens) {
    return state.cards[cardId].token[expr.tokens];
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
