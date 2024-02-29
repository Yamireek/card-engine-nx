import { Scope, ScopeAction } from '@card-engine-nx/state';
import { getTargetPlayers } from '../player/target/multi';
import { isArray } from 'lodash/fp';
import { ViewContext } from '../context/view';
import { getTargetCards } from '../card/target/multi';

export function executeScopeAction(
  action: ScopeAction,
  scope: Scope,
  ctx: ViewContext,
  scopes: Scope[]
) {
  if (isArray(action)) {
    for (const item of action) {
      executeScopeAction(item, scope, ctx, scopes);
    }
    return;
  }

  if ('var' in action && 'card' in action) {
    const target = getTargetCards(action.card, ctx, scopes);

    if (!scope.card) {
      scope.card = {};
    }
    scope.card[action.var] = target;
    return;
  }

  if ('var' in action && 'player' in action) {
    const target = getTargetPlayers(action.player, ctx, scopes);

    if (!scope.player) {
      scope.player = {};
    }
    scope.player[action.var] = target;
    return;
  }

  if ('x' in action) {
    scope.x = action.x;
    return;
  }

  throw new Error(`unknown scope action: ${JSON.stringify(action, null, 1)}`);
}
