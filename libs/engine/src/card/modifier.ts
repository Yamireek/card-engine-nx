import {
  CardView,
  State,
  Modifier,
  Context,
  View,
} from '@card-engine-nx/state';
import { calculateExpr } from '../expr';

export function applyModifier(
  modifier: Modifier,
  state: State,
  view: View,
  card: CardView,
  ctx: Context
) {
  if (modifier.increment) {
    const amount = calculateExpr(modifier.increment.amount, state, view, ctx);
    const value = card.props[modifier.increment.prop];
    if (value !== undefined) {
      card.props[modifier.increment.prop] = value + amount;
    }

    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
