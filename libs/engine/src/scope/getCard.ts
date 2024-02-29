import { CardId } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';
import { reverse } from 'lodash/fp';
import { Scope } from '@card-engine-nx/state';

export function getCardFromScope(
  ctx: ViewContext,
  scopes: Scope[],
  name: string
): CardId[] | undefined {
  const all = [...ctx.state.scopes, ...scopes];
  const reversed = reverse(all);
  const scope = reversed.find((s) => s.card && s.card[name]);
  return scope?.card?.[name];
}
