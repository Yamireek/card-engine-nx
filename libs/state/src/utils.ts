import { CardDefinition, Types } from '@card-engine-nx/algebras';
import { CardState } from './card';
import { PlayerId, Side } from '@card-engine-nx/basic';
import { ExecutorTypes } from './types';

export function createCardState(
  id: number,
  definition: CardDefinition<Types & ExecutorTypes>,
  side: Side,
  owner: PlayerId | 'game'
): CardState {
  return {
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
    owner,
    controller: owner,
    limitUses: {
      phase: {},
      round: {},
    },
    modifiers: [],
  };
}
