import { last } from 'lodash';
import { ZoneId, getZoneIdString } from '@card-engine-nx/basic';
import { getZoneState } from '@card-engine-nx/engine';
import { State, ZoneState } from '@card-engine-nx/state';
import {
  Vector3,
  getCardImageUrl,
  image,
  useTextures,
} from '@card-engine-nx/ui';
import { useGameState } from '../game/StateContext';
import { Deck3d } from './Deck3d';

function getDeckImage(zoneId: ZoneId, zone: ZoneState, state: State): string {
  const topCardId = last(zone.cards);
  if (!topCardId) {
    return typeof zoneId === 'string' ? image.encounterBack : image.playerBack;
  }

  const card = state.cards[topCardId];
  const side = card.sideUp === 'shadow' ? 'front' : card.sideUp;

  return getCardImageUrl(card.definition[side], side);
}

export type LotrDeck3dProps = { zone: ZoneId; position: Vector3 };

export const LotrDeck3d = (props: LotrDeck3dProps) => {
  const { state } = useGameState();
  const { texture } = useTextures();

  const zone = getZoneState(props.zone, state);

  return (
    <Deck3d
      name={`deck-${getZoneIdString(props.zone)}`}
      title={typeof props.zone === 'string' ? props.zone : props.zone.type}
      position={props.position}
      cardCount={zone.cards.length}
      texture={texture[getDeckImage(props.zone, zone, state)]}
    />
  );
};
