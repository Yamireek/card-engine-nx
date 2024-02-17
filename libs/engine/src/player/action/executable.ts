import { PlayerAction } from '@card-engine-nx/state';
import { updatedCtx } from '../../context/update';
import { ViewContext } from '../../context/view';
import { sumBy } from 'lodash';
import { PlayerId } from '@card-engine-nx/basic';
import { getTargetPlayers } from '../target/multi';
import { isArray } from 'lodash/fp';
import { canCardExecute } from '../../card/action/executable';
import { calculateNumberExpr } from '../../expression/number/calculate';
import { canExecute } from '../../action/executable';
import { getTargetCards } from '../../card/target/multi';

export function canPlayerExecute(
  action: PlayerAction,
  playerId: PlayerId,
  ctx: ViewContext
): boolean {
  if (isArray(action)) {
    return action.every((a) => canPlayerExecute(a, playerId, ctx));
  }

  const player = ctx.state.players[playerId];
  if (!player || player.eliminated) {
    return false;
  }

  if (typeof action === 'string') {
    if (action === 'resolvePlayerAttacks') {
      return true;
    }

    if (action === 'shuffleLibrary') {
      return true;
    }

    throw new Error(
      `not implemented: canPlayerExecute ${JSON.stringify(action)}`
    );
  } else {
    if (action.chooseCardActions) {
      const targets = getTargetCards(action.chooseCardActions.target, ctx);
      const cardAction = action.chooseCardActions.action;
      return targets.some((id) =>
        canCardExecute(
          cardAction,
          id,
          updatedCtx(ctx, { var: 'target', card: id })
        )
      );
    }

    if (action.choosePlayerActions) {
      const targets = getTargetPlayers(action.choosePlayerActions.target, ctx);
      const playerAction = action.choosePlayerActions.action;
      return targets.some((id) => canPlayerExecute(playerAction, id, ctx));
    }

    if (action.payResources) {
      const sphere = action.payResources.sphere;
      const cost = calculateNumberExpr(action.payResources.amount, ctx);
      const heroes = player.zones.playerArea.cards
        .map((c) => ctx.view.cards[c])
        .filter((c) => c.props.type === 'hero')
        .filter(
          (c) =>
            sphere.includes('neutral') ||
            c.props.sphere?.some((s) => sphere.includes(s))
        )
        .filter((c) => ctx.state.cards[c.id].token.resources > 0);

      if (
        action.payResources.needHeroes &&
        heroes.length < action.payResources.needHeroes
      ) {
        return false;
      }

      const available = sumBy(
        heroes,
        (h) => ctx.state.cards[h.id].token.resources
      );

      return available >= cost;
    }

    if (action.draw) {
      const pv = ctx.view.players[player.id];
      return player.zones.library.cards.length > 0 && !pv?.rules.disableDraw;
    }

    if (action.discard) {
      return player.zones.hand.cards.length >= action.discard.amount;
    }

    if (action.useLimit) {
      const existing = player.limits[action.useLimit.key];
      return !existing || existing.uses < action.useLimit.limit.max;
    }

    if (action.engaged) {
      const cardAction = action.engaged;
      return player.zones.engaged.cards.some((c) =>
        canCardExecute(cardAction, c, ctx)
      );
    }

    if (action.controlled) {
      const cardAction = action.controlled;
      const cards = getTargetCards({ controller: player.id }, ctx);
      return cards.some((c) => canCardExecute(cardAction, c, ctx));
    }

    if (action.modify) {
      if (action.modify.rules.multipleDefenders) {
        return player.zones.engaged.cards.length > 0;
      }

      return true;
    }

    if (action.chooseActions) {
      const actions = action.chooseActions.actions.filter((a) =>
        canExecute(a.action, false, ctx)
      );

      return actions.length > 0;
    }

    if (action.incrementThreat) {
      return true;
    }

    if (action.deck) {
      return player.zones.library.cards.length > 0;
    }

    if (action.card) {
      return canExecute(
        {
          card: action.card.target,
          action: action.card.action,
        },
        false,
        ctx
      );
    }

    if (action.player) {
      return canExecute(
        {
          player: action.player.target,
          action: action.player.action,
        },
        false,
        ctx
      );
    }

    if (action.chooseX) {
      const min = calculateNumberExpr(action.chooseX.min, ctx);
      const max = calculateNumberExpr(action.chooseX.max, ctx);
      return max >= min;
    }

    throw new Error(
      `not implemented: canPlayerExecute ${JSON.stringify(action)}`
    );
  }
}
