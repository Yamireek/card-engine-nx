import { CardView, Ability } from '@card-engine-nx/state';

export function applyAbility(ability: Ability, card: CardView) {
  if (ability.modifier) {
    card.modifiers.push({
      applied: false,
      description: ability.description,
      modifier: ability.modifier,
    });
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
    card.actions.push({
      description: ability.description,
      action: ability.action,
      limit: ability.limit,
    });
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
