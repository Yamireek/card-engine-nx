import { CardId } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';
import { reverse } from 'lodash/fp';

export function getCardFromScope(
  ctx: ViewContext,
  name: string
): CardId[] | undefined {
  const reversed = reverse(ctx.scopes);
  const scope = reversed.find((s) => s.card && s.card[name]);
  return scope?.card?.[name];
}
