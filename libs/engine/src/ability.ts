import { Modifier, Ability } from '@card-engine-nx/state';

export function selfModifier(params: {
  description: string;
  modifier: Modifier;
}): Ability {
  return {
    description: params.description,
    print: () => `selfModifier(${params.modifier.print()})`,
    apply(state, card) {
      card.modifiers.push({
        description: params.description,
        applied: false,
        modifier: params.modifier,
      });
    },
  };
}
