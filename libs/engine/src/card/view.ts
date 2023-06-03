import { CardState, CardView } from '@card-engine-nx/state';

export function createCardView(state: CardState): CardView {
  const printed = state.definition[state.sideUp];
  return {
    id: state.id,
    props: printed,
    abilities: printed.abilities
      ? printed.abilities.map((a) => ({ applied: false, ability: a }))
      : [],
    modifiers: state.modifiers.map((m) => ({ applied: false, ...m })),
    setup: [],
    actions: [],
  };
}
