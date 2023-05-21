import { CardId } from '@card-engine-nx/basic';
import { State, CardNumberExpr } from '@card-engine-nx/state';

export function calculateCardExpr(
  expr: CardNumberExpr,
  state: State,
  cardId: CardId
): number {
  if (expr.tokens) {
    return state.cards[cardId].token[expr.tokens];
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
