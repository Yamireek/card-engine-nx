import { CardView, Ability } from '@card-engine-nx/state';

export function applyAbility(ability: Ability, card: CardView) {
  if (ability.selfModifier) {
    card.modifiers.push({
      applied: false,
      description: ability.description,
      modifier: ability.selfModifier,
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

  throw new Error(`unknown ability: ${JSON.stringify(ability)}`);
}
