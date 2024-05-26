import { CardId } from '@card-engine-nx/basic';
import { CardTarget, Scope } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { getTargetCards } from './multi';

export function getTargetCard(target: CardTarget, ctx: ViewContext): CardId {
  const results = getTargetCards(target, ctx);
  if (results.length <= 1) {
    return results[0];
  } else {
    throw new Error('unexpected result count');
  }
}
