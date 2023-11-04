import { CardId, PlayerId, Side, ZoneId } from '@card-engine-nx/basic';
import { CardDefinition } from '../definitions/types';
import { CardState } from './state';

export function createCardState(
  id: CardId,
  side: Side,
  definition: CardDefinition,
  owner: PlayerId | undefined,
  zone: ZoneId
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
}
