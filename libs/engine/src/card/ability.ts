import { CardView, Ability } from '@card-engine-nx/state';
import { applyModifier } from './modifier';
import { ViewContext } from '../context';
import { createCardActions } from '../view';
import { GameZoneType, PlayerZoneType } from '@card-engine-nx/basic';

export function applyAbility(
  ability: Ability,
  card: CardView,
  zone: PlayerZoneType | GameZoneType,
  ctx: ViewContext
) {
  if (ability.modifier) {
    applyModifier(ability.modifier, card, ctx);
    return;
  }

  if (ability.setup) {
    if (!card.setup) {
      card.setup = [];
    }
    card.setup.push(ability.setup);
    return;
  }

  if (ability.action) {
    const controller = ctx.state.cards[card.id].controller;
    if (controller) {
      const actions = createCardActions(
        zone,
        card,
        card.id,
        controller,
        ctx.state.phase
      );

      ctx.view.actions.push(...actions);
    }
    return;
  }

  if (ability.attachesTo) {
    card.attachesTo = ability.attachesTo;
    return;
  }

  if (ability.response) {
    if (!card.responses) {
      card.responses = {};
    }
    if (!card.responses[ability.response.event]) {
      card.responses[ability.response.event] = [];
    }

    card.responses[ability.response.event]?.push({
      description: ability.description,
      action: ability.response.action,
    });
    return;
  }

  throw new Error(`unknown ability: ${JSON.stringify(ability)}`);
}
