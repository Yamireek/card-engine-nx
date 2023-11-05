import { Scope, ScopeAction } from '@card-engine-nx/state';
import { executeScopeAction } from '../scope/execute';
import { ViewContext } from './view';

export function updatedCtx<T extends ViewContext>(
  ctx: T,
  action: ScopeAction
): T {
  const scope: Scope = {};
  executeScopeAction(action, scope, ctx);
  return { ...ctx, scopes: [...ctx.scopes, scope] };
}
