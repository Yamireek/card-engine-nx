import { CardId } from '@card-engine-nx/basic';
import { State, CardTarget, Context } from '@card-engine-nx/state';

export function getTargetCard(
  target: CardTarget,
  state: State,
  ctx: Context
): CardId[] {
  if (target === 'self') {
    if (ctx.selfCard) {
      return [ctx.selfCard];
    } else {
      throw new Error('no self card in context');
    }
  }

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
