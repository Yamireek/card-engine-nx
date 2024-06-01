import { reverse } from 'lodash/fp';
import { PlayerId } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';

export function getPlayerFromScope(
  ctx: ViewContext,
  name: string
): PlayerId[] | undefined {
  const reversed = reverse(ctx.scopes);
  const scope = reversed.find((s) => s.player && s.player[name]);
  return scope?.player?.[name];
}
