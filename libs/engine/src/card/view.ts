import { cloneDeep } from 'lodash/fp';
import { CardState, CardView } from '@card-engine-nx/state';

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
    rules: {},
  };
}
