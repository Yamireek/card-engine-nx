import { CardState, CardView } from '@card-engine-nx/state';
import { cloneDeep } from 'lodash/fp';

export function createCardView(state: CardState): CardView {
  const printed = state.definition[state.sideUp];
  return {
    id: state.id,
    printed,
    props: cloneDeep(printed),
    abilities: printed.abilities
      ? printed.abilities.map((a) => ({
          applied: false,
          ability: cloneDeep(a),
        }))
      : [],
    modifiers: state.modifiers.map((m) => ({
      applied: false,
      ...cloneDeep(m),
    })),
    setup: [],
    actions: [],
  };
}
