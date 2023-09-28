import { CardState, CardView } from '@card-engine-nx/state';
import { cloneDeep } from 'lodash/fp';

export function createCardView(state: CardState): CardView {
  const printed = state.definition[state.sideUp];
  return {
    id: state.id,
    printed,
    props: cloneDeep(printed),
    setup: [],
    zone: state.zone,
  };
}
