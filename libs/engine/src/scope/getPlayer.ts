import { PlayerId } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';
import { reverse } from 'lodash/fp';

export function getPlayerFromScope(
  ctx: ViewContext,
  name: string
): PlayerId[] | undefined {
  const scopes = [...ctx.state.scopes, ...ctx.scopes];
  const reversed = reverse(scopes);
  const scope = reversed.find((s) => s.player && s.player[name]);
  return scope?.player?.[name];
}
