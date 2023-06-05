import { CardView, Modifier } from '@card-engine-nx/state';
import { calculateExpr } from '../expr';
import { ExecutionContext } from '../action';

export function applyModifier(
  modifier: Modifier,
  card: CardView,
  ctx: ExecutionContext
) {
  if (modifier.increment) {
    const amount = calculateExpr(modifier.increment.amount, ctx);
    const value = card.props[modifier.increment.prop];
    if (value !== undefined && amount) {
      card.props[modifier.increment.prop] = value + amount;
    }

    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
