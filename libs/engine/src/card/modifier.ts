import { CardView, Modifier } from '@card-engine-nx/state';
import { calculateNumberExpr } from '../expr';
import { ViewContext } from '../context';

export function applyModifier(
  modifier: Modifier,
  card: CardView,
  ctx: ViewContext
) {
  if (modifier.add) {
    const amount = calculateNumberExpr(modifier.add.amount, ctx);
    const value = card.props[modifier.add.prop];
    if (value !== undefined && amount) {
      card.props[modifier.add.prop] = value + amount;
    }

    return;
  }

  if (modifier.setNextStage) {
    card.nextStage = modifier.setNextStage;
    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
