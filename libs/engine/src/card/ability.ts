import { CardView, Modifier } from '@card-engine-nx/state';
import { applyModifier } from './modifier';
import { ViewContext } from '../context';
import { createCardActions } from '../view';
import { GameZoneType, PlayerZoneType } from '@card-engine-nx/basic';
import { sequence } from '../utils/sequence';
import { getTargetCards } from './target';
import { calculateNumberExpr } from '../expr';

export function applyAbility(
  ability: Modifier,
  self: CardView,
  zone: PlayerZoneType | GameZoneType,
  ctx: ViewContext
) {
  if (ability.bonus) {
    const targets = ability.target
      ? getTargetCards(ability.target, ctx)
      : getTargetCards(self.id, ctx);

    for (const id of targets) {
      const amount = calculateNumberExpr(ability.bonus.amount, ctx);
      const card = ctx.view.cards[id];
      const value = card.props[ability.bonus.property];
      if (value !== undefined && amount) {
        card.props[ability.bonus.property] = value + amount;
      }
    }

    return;
  }

  if (ability.setNextStage) {
    // TODO setNextStage
    //self.ability = ability.setNextStage;
    return;
  }

  if (ability.disable) {
    if (!self.disabled) {
      self.disabled = {};
    }

    self.disabled[ability.disable] = true;
    return;
  }

  if (ability.setup) {
    if (!self.setup) {
      self.setup = [];
    }
    self.setup.push(ability.setup);
    return;
  }

  if (ability.action) {
    const controller = ctx.state.cards[self.id].controller;
    if (controller) {
      if (zone === 'playerArea') {
        ctx.view.actions.push({
          description: ability.description,
          card: self.id,
          action: sequence(
            { setCardVar: { name: 'self', value: self.id } },
            { setPlayerVar: { name: 'controller', value: controller } },
            {
              useLimit: {
                type: ability.limit ?? 'none',
                card: self.id,
                index: 0, // TODO ability index
              },
            },
            ability.action,
            { setPlayerVar: { name: 'controller', value: undefined } },
            { setCardVar: { name: 'self', value: undefined } }
          ),
          limit: ability.limit,
          payment: ability.payment,
          phase: ability.phase,
        });
      }
    }
    return;
  }

  if (ability.attachesTo) {
    self.attachesTo = ability.attachesTo;
    return;
  }

  if (ability.response) {
    if (!self.responses) {
      self.responses = {};
    }
    if (!self.responses[ability.response.event]) {
      self.responses[ability.response.event] = [];
    }

    self.responses[ability.response.event]?.push({
      description: ability.description,
      action: ability.response.action,
    });
    return;
  }

  throw new Error(`unknown ability: ${JSON.stringify(ability)}`);
}
