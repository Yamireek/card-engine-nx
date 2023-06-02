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

  throw new Error(`unknown ability: ${JSON.stringify(ability)}`);
}
