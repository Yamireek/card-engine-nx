import { CardView, Modifier } from '@card-engine-nx/state';
import { calculateNumberExpr } from '../expr';
import { ViewContext } from '../context';
import { getTargetCards } from './target';

export function applyModifier(
  modifier: Modifier,
  self: CardView,
  ctx: ViewContext
) {
  if (modifier.add) {
    const targets = modifier.target
      ? getTargetCards(modifier.target, ctx)
      : getTargetCards(self.id, ctx);

    for (const id of targets) {
      const amount = calculateNumberExpr(modifier.add.amount, ctx);
      const card = ctx.view.cards[id];
      const value = card.props[modifier.add.prop];
      if (value !== undefined && amount) {
        card.props[modifier.add.prop] = value + amount;
      }
    }

    return;
  }

  if (modifier.setNextStage) {
    self.nextStage = modifier.setNextStage;
    return;
  }

  if (modifier.disable) {
    if (!self.disabled) {
      self.disabled = {};
    }

    self.disabled[modifier.disable] = true;
    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
