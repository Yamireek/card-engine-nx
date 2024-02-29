import { Scope } from '@card-engine-nx/state';
import { ViewContext } from '../context';
import { reverse } from 'lodash/fp';

export function getFromScope<T>(
  ctx: ViewContext,
  scopes: Scope[],
  getter: (s: Scope) => T | undefined
): T | undefined {
  const all = [...ctx.state.scopes, ...scopes];
  const reversed = reverse(all);
  const scope = reversed.find(getter);
  return scope ? getter(scope) : undefined;
}
