import { Scope, ScopeAction, State, View } from '@card-engine-nx/state';
import { UIEvents } from './uiEvents';
import { CardId } from '@card-engine-nx/basic';
import { Random } from './utils/random';
import { executeScopeAction } from './action';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  random: Random;
  scopes: Scope[];
};

export type ViewContext = {
  state: State;
  view: View;
  scopes: Scope[];
};

export function cardIds(ctx: ViewContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}

export function updatedCtx<T extends ViewContext>(
  ctx: T,
  action: ScopeAction
): T {
  const scope: Scope = {};
  executeScopeAction(action, scope, ctx);
  return { ...ctx, scopes: [...ctx.scopes, scope] };
}
