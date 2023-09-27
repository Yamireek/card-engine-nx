import { CardView, Modifier } from '@card-engine-nx/state';
import { calculateNumberExpr } from '../expr';
import { ViewContext } from '../context';
import { getTargetCards } from './target';

export function applyModifier(
  modifier: Modifier,
  self: CardView,
  ctx: ViewContext
) {
  // TODO remove
  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
