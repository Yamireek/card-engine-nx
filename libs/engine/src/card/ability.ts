import { CardView, State, Ability } from '@card-engine-nx/state';

export function applyAbility(ability: Ability, state: State, card: CardView) {
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
