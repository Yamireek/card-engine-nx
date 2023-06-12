import { ZoneId } from '@card-engine-nx/basic';
import {
  Vector3,
  getCardImageUrl,
  image,
  useTextures,
} from '@card-engine-nx/ui';
import { Deck3d } from './Deck3d';
import { useGameState } from './StateContext';
import { getZoneState } from '@card-engine-nx/engine';
import { last } from 'lodash';
import { State, ZoneState } from '@card-engine-nx/state';

function getDeckImage(zoneId: ZoneId, zone: ZoneState, state: State): string {
  const topCardId = last(zone.cards);
  if (!topCardId) {
    return zoneId.owner === 'game' ? image.encounterBack : image.playerBack;
  }

  const card = state.cards[topCardId];
  const side = card.sideUp;

  return getCardImageUrl(card.definition[side], side);
}

export type LotrDeck3dProps = { zone: ZoneId; position: Vector3 };

export const LotrDeck3d = (props: LotrDeck3dProps) => {
  const { state } = useGameState();
  const { texture } = useTextures();

  const zone = getZoneState(props.zone, state);

  return (
    <Deck3d
      name={`deck-${props.zone.owner}-${props.zone.type}`}
      title={props.zone.type}
      position={props.position}
      cardCount={zone.cards.length}
      texture={texture[getDeckImage(props.zone, zone, state)]}
    />
  );
};
