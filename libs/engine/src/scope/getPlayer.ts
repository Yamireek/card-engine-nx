import { PlayerId } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';
import { reverse } from 'lodash/fp';
import { Scope } from '@card-engine-nx/state';

export function getPlayerFromScope(
  ctx: ViewContext,
  name: string
): PlayerId[] | undefined {
  const reversed = reverse(ctx.scopes);
  const scope = reversed.find((s) => s.player && s.player[name]);
  return scope?.player?.[name];
}
