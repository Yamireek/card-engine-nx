import { Action } from '@card-engine-nx/state';
import { updatedCtx } from '../context/update';
import { ViewContext } from '../context/view';
import { getTargetCards } from '../card';
import { getTargetPlayers } from '../player/target/multi';
import { isArray } from 'lodash/fp';
import { canCardExecute } from '../card/action/executable';
import { calculateBoolExpr } from '../expression/bool/calculate';
import { canPlayerExecute } from '../player/action/executable';

export function canExecute(
  action: Action,
  payment: boolean,
  ctx: ViewContext
): boolean {
  if (isArray(action)) {
    return action.every((a) => canExecute(a, payment, ctx));
  }

  if (typeof action === 'string') {
    if (action === 'revealEncounterCard') {
      return true;
    }

    if (action === 'shuffleEncounterDeck') {
      return true;
    }

    if (action === 'endScope') {
      return true;
    }

    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
    if ('player' in action && 'action' in action) {
      return canExecute(
        { player: { target: action.player, action: action.action } },
        payment,
        ctx
      );
    }

    if ('card' in action && 'action' in action) {
      return canExecute(
        { card: { target: action.card, action: action.action } },
        payment,
        ctx
      );
    }

    if ('useScope' in action) {
      return canExecute(
        action.action,
        payment,
        updatedCtx(ctx, action.useScope)
      );
    }

    if (action.player) {
      const playerAction = action.player;
      const players = getTargetPlayers(playerAction.target, ctx);
      return players.some((p) =>
        canPlayerExecute(
          playerAction.action,
          p,
          updatedCtx(ctx, { var: 'target', player: p })
        )
      );
    }

    if (action.card) {
      const cardAction = action.card;
      const cards = getTargetCards(cardAction.target, ctx);
      return cards.some((card) =>
        canCardExecute(
          cardAction.action,
          card,
          updatedCtx(ctx, { var: 'target', card })
        )
      );
    }

    if (action.payment) {
      const payment = canExecute(action.payment.cost, true, ctx);
      const effect = canExecute(action.payment.effect, false, ctx);
      return payment && effect;
    }

    if (action.useLimit) {
      const card = action.useLimit.card;
      const existing = ctx.state.actionLimits.find((u) => u.card === card);
      return !existing || existing.amount < action.useLimit.max;
    }

    if (action.resolveAttack) {
      return true;
    }

    if (action.atEndOfPhase) {
      return true;
    }

    if (action.placeProgress) {
      return true;
    }

    if (action.cancel) {
      return ctx.state.stack.length > 0;
    }

    if (action.event) {
      return true;
    }

    if (action.repeat) {
      return canExecute(action.repeat.action, payment, ctx);
    }

    if (action.if) {
      const result = calculateBoolExpr(action.if.condition, ctx);
      if (result) {
        return (
          action.if.true !== undefined &&
          canExecute(action.if.true, payment, ctx)
        );
      } else {
        return (
          action.if.false !== undefined &&
          canExecute(action.if.false, payment, ctx)
        );
      }
    }
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}
