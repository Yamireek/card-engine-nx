import { CardView, Modifier } from '@card-engine-nx/state';
import { calculateNumberExpr } from '../expr';
import { ViewContext } from '../context';

export function applyModifier(
  modifier: Modifier,
  card: CardView,
  ctx: ViewContext
) {
  if (modifier.increment) {
    const amount = calculateNumberExpr(modifier.increment.amount, ctx);
    const value = card.props[modifier.increment.prop];
    if (value !== undefined && amount) {
      card.props[modifier.increment.prop] = value + amount;
    }

    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
