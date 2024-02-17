import { CardState, CardView } from '@card-engine-nx/state';
import { cloneDeep } from 'lodash/fp';

export function createCardView(state: CardState): CardView {
  if (state.sideUp === 'shadow') {
    return {
      id: state.id,
      printed: {
        type: 'shadow',
        sphere: [],
        traits: [],
      },
      props: {
        type: 'shadow',
        traits: [],
        sphere: [],
      },
      zone: state.zone,
      travel: [],
      refreshCost: [],
      rules: {
        shadows: state.definition.shadow
          ? [state.definition.shadow]
          : undefined,
      },
    };
  }

  const printed = state.definition[state.sideUp];
  return {
    id: state.id,
    printed,
    props: cloneDeep(printed),
    zone: state.zone,
    travel: [],
    refreshCost: [],
    rules: {},
  };
}
