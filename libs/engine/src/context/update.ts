import { asArray } from '@card-engine-nx/basic';
import { Scope, ScopeAction } from '@card-engine-nx/state';
import { executeScopeAction } from '../scope/execute';
import { ViewContext } from './view';

export function updatedScopes(
  ctx: ViewContext,
  actions: ScopeAction | ScopeAction[]
): ViewContext {
  const newScope: Scope = {};
  for (const action of asArray(actions)) {
    executeScopeAction(action, newScope, ctx);
  }
  return {
    state: ctx.state,
    view: ctx.view,
    scopes: [...ctx.scopes, newScope],
  };
}
