import { reverse } from 'lodash/fp';
import { Scope } from '@card-engine-nx/state';
import { ViewContext } from '../context';

export function getFromScope<T>(
  ctx: ViewContext,
  getter: (s: Scope) => T | undefined
): T | undefined {
  const reversed = reverse(ctx.scopes);
  const scope = reversed.find(getter);
  return scope ? getter(scope) : undefined;
}
