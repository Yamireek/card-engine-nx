import {
  Action,
  CardAction,
  CostModifier,
  PlayerAction,
} from '@card-engine-nx/state';
import { ViewContext } from './context';
import { getTargetCards } from './card';
import { sumBy } from 'lodash';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { getTargetPlayers } from './player/target';
import { isArray } from 'lodash/fp';
import { isInPlay } from './utils';

export function canExecute(
  action: Action,
  payment: boolean,
  ctx: ViewContext
): boolean {
  if (isArray(action)) {
    return action.every((a) => canExecute(a, payment, ctx));
  }

  if (typeof action === 'string') {
    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  } else {
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
      const existing = ctx.state.actionLimits.some(
        (u) =>
          u.card === action.useLimit?.card && u.index === action.useLimit.index
      );

      return !existing;
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
        .filter((c) => sphere === 'neutral' || c.props.sphere === sphere)
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

    if (action.setLimit) {
      return !player.limits[action.setLimit.key];
    }

    if (action.engaged) {
      const cardAction = action.engaged;
      return player.zones.engaged.cards.some((c) =>
        canCardExecute(cardAction, c, ctx)
      );
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

export function canCardExecute(
  action: CardAction,
  cardId: CardId,
  ctx: ViewContext
): boolean {
  if (isArray(action)) {
    return action.every((a) => canCardExecute(a, cardId, ctx));
  }

  const card = ctx.state.cards[cardId];
  const zone = card.zone;
  const inPlay = isInPlay(zone);

  if (typeof action === 'string') {
    if (inPlay && action === 'travel') {
      return ctx.state.zones.activeLocation.cards.length === 0;
    }

    if (inPlay && action === 'exhaust') {
      return !card.tapped && card.zone === 'playerArea';
    }

    if (inPlay && action === 'ready') {
      return card.tapped;
    }

    if (zone === 'hand' && action === 'discard') {
      return true;
    }

    if (zone === 'encounterDeck' && action === 'reveal') {
      return true;
    }

    if (zone === 'library' && action === 'draw') {
      if (!card.owner) {
        return false;
      }

      const owner = ctx.view.players[card.owner];
      return card.zone === 'library' && !owner?.disableDraw;
    }

    return false;
  }

  if (zone === 'playerArea' && action.declareAsDefender) {
    return !card.tapped;
  }

  if (zone === 'playerArea' && action.payResources) {
    const card = ctx.state.cards[cardId];
    return card.token.resources >= action.payResources;
  }

  if (zone === 'engaged' && action.resolveEnemyAttacking) {
    return true;
  }

  if (inPlay && action.mark) {
    const disabled = ctx.view.cards[cardId].disabled?.[action.mark];
    return !disabled;
  }

  if (action.clear) {
    return true;
  }

  if (inPlay && action.dealDamage) {
    return true;
  }

  if (
    zone === 'encounterDeck' &&
    card.sideUp === 'front' &&
    action.dealDamage
  ) {
    return true;
  }

  if (zone === 'playerArea' && action.heal) {
    return card.token.damage > 0;
  }

  if (action.move) {
    return true;
  }

  if (inPlay && action.attachCard) {
    return true;
  }

  if (inPlay && action.modify) {
    return true;
  }

  if (action.setAsVar) {
    return true;
  }

  if (inPlay && action.generateResources) {
    return true;
  }

  if (zone === 'engaged' && action.resolvePlayerAttacking) {
    return true;
  }

  if (zone === 'hand' && action.payCost) {
    if (!card.controller) {
      return false;
    }

    const payCostAction = createPayCostAction(cardId, action.payCost, ctx);

    if (!payCostAction) {
      return false;
    }

    return canPlayerExecute(payCostAction, card.controller, ctx);
  }

  if (zone === 'stagingArea' && action.engagePlayer) {
    return true;
  }

  return false;
}

export function createPayCostAction(
  cardId: CardId,
  modifiers: CostModifier,
  ctx: ViewContext
): PlayerAction | undefined {
  const view = ctx.view.cards[cardId];
  const state = ctx.state.cards[cardId];

  if (state.zone !== 'hand' || !state.controller) {
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
