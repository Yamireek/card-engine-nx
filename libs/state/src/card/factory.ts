import { CardId, PlayerId, Side, ZoneId } from '@card-engine-nx/basic';
import { CardDefinition } from '../definitions/types';
import { CardState } from './state';
import { CardView } from './view';
import { cloneDeep } from 'lodash';

export function createCardState(
  id: CardId,
  side: Side,
  definition: CardDefinition,
  owner: PlayerId | undefined,
  zone: ZoneId
): CardState {
  const baseState: Omit<CardState, 'view'> = {
    id,
    token: {
      damage: 0,
      progress: 0,
      resources: 0,
    },
    mark: {
      questing: false,
      attacking: false,
      defending: false,
      attacked: false,
    },
    sideUp: side,
    tapped: false,
    definition: definition,
    attachments: [],
    shadows: [],
    owner: owner,
    controller: owner,
    limitUses: {
      phase: {},
      round: {},
    },
    keywords: {},
    zone,
  };

  return { ...baseState, view: createCardView(baseState) };
}

export function createCardView(state: Omit<CardState, 'view'>): CardView {
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
