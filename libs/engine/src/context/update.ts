import { Scope, ScopeAction } from '@card-engine-nx/state';
import { executeScopeAction } from '../scope/execute';
import { ViewContext } from './view';

export function updatedScopes(
  ctx: ViewContext,
  scopes: Scope[],
  action: ScopeAction
): Scope[] {
  const scope: Scope = {};
  executeScopeAction(action, scope, ctx, scopes);
  return [...scopes, scope];
}
