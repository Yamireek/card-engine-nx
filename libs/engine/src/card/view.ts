import { AbilityView, CardState, CardView } from '@card-engine-nx/state';
import { cloneDeep } from 'lodash/fp';
import { createAllyAction } from './ability';
import { CardId, PlayerId, PrintedProps } from '@card-engine-nx/basic';

export function createCardView(state: CardState): CardView {
  const printed = state.definition[state.sideUp];

  const abilities = printed.abilities
    ? printed.abilities.map((a) => ({
        applied: false,
        printed: true,
        ability: cloneDeep(a),
      }))
    : [];

  const modifiers = state.modifiers.map((m) => ({
    applied: false,
    printed: false,
    ability: cloneDeep(m),
  }));

  return {
    id: state.id,
    printed,
    props: cloneDeep(printed),
    abilities: [...abilities, ...modifiers],
    setup: [],
    actions: [],
  };
}
