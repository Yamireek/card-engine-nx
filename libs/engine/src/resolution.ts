import {
  Action,
  CostModifier,
  PlayerAction,
  event,
} from '@card-engine-nx/state';
import { ViewContext } from './context';
import { getTargetCards } from './card';
import { sumBy } from 'lodash';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { getTargetPlayers } from './player/target';
import { isArray } from 'lodash/fp';
import { canCardExecute } from './card/resolution';
import { getZoneType } from './zone/target';

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

    if (action.player) {
      const playerAction = action.player;
      const players = getTargetPlayers(playerAction.target, ctx);
      return players.some((p) => canPlayerExecute(playerAction.action, p, ctx));
    }

    if (action.card) {
      const cardAction = action.card;
      const cards = getTargetCards(cardAction.target, ctx);
      return cards.some((card) => canCardExecute(cardAction.action, card, ctx));
    }

    if (action.setCardVar) {
      return true;
    }

    if (action.setPlayerVar) {
      return true;
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

    if (action.useCardVar) {
      return canExecute(action.useCardVar.action, payment, {
        ...ctx,
        card: {
          ...ctx.card,
          [action.useCardVar.name]: action.useCardVar.value,
        },
      });
    }

    if (action.usePlayerVar) {
      return canExecute(action.usePlayerVar.action, payment, {
        ...ctx,
        player: {
          ...ctx.player,
          [action.usePlayerVar.name]: action.usePlayerVar.value,
        },
      });
    }

    if (action.cancel) {
      return ctx.state.stack.length > 0;
    }

    if (action.event) {
      return true;
    }
  }

  throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
}

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
      return targets.some((id) => canCardExecute(cardAction, id, ctx));
    }

    if (action.choosePlayerActions) {
      const targets = getTargetPlayers(action.choosePlayerActions.target, ctx);
      const playerAction = action.choosePlayerActions.action;
      return targets.some((id) => canPlayerExecute(playerAction, id, ctx));
    }

    if (action.payResources) {
      const sphere = action.payResources.sphere;
      const cost = action.payResources.amount;
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
        action.payResources.heroes &&
        heroes.length < action.payResources.heroes
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
      return player.zones.library.cards.length > 0 && !pv?.disableDraw;
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
      if (action.modify === 'can_declate_multiple_defenders') {
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

    if (action.useVar) {
      return canPlayerExecute(action.useVar.action, player.id, {
        ...ctx,
        player: { ...ctx.player, [action.useVar.name]: player.id },
      });
    }

    if (action.deck) {
      return player.zones.library.cards.length > 0;
    }

    if (action.card) {
      return canExecute(
        {
          card: {
            target: action.card.target,
            action: action.card.action,
          },
        },
        false,
        ctx
      );
    }

    throw new Error(
      `not implemented: canPlayerExecute ${JSON.stringify(action)}`
    );
  }
}

export function createPayCostAction(
  cardId: CardId,
  modifiers: CostModifier,
  ctx: ViewContext
): PlayerAction | undefined {
  const view = ctx.view.cards[cardId];
  const state = ctx.state.cards[cardId];
  const zone = getZoneType(state.zone);

  if (zone !== 'hand' || !state.controller) {
    return undefined;
  }

  const sphere = view.props.sphere;
  const amount = view.props.cost;

  if (!sphere || amount === undefined) {
    return undefined;
  }

  return {
    payResources: {
      amount,
      sphere,
      ...modifiers,
    },
  };
}
