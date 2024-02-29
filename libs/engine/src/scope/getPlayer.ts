import { PlayerId } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';
import { reverse } from 'lodash/fp';
import { Scope } from '@card-engine-nx/state';

export function getPlayerFromScope(
  ctx: ViewContext,
  scopes: Scope[],
  name: string
): PlayerId[] | undefined {
  const all = [...ctx.state.scopes, ...scopes];
  const reversed = reverse(all);
  const scope = reversed.find((s) => s.player && s.player[name]);
  return scope?.player?.[name];
}
