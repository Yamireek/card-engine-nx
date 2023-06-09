import { PrintedProps, Side } from '@card-engine-nx/basic';
import { CardDefinition } from '@card-engine-nx/state';
import { image } from '.';

export type CardImageUrls = { front: string; back: string };

export function getCardImageUrl(props: PrintedProps, side: Side): string {
  if (props.type === 'player_back') {
    return image.playerBack;
  }

  if (props.type === 'encounter_back') {
    return image.encounterBack;
  }

  if (props.type === 'quest') {
    const name = props.name ?? '';
    return `./images/cards/01-core/${props.sequence}${
      side === 'front' ? 'A' : 'B'
    } - ${name.replace("'", '_')}.jpg`;
  }

  const name = props.name || props.type;
  return `./images/cards/01-core/${name.replace("'", '_')}.jpg`;
}

export function getCardImageUrls(card: CardDefinition): CardImageUrls {
  return {
    front: getCardImageUrl(card.front, 'front'),
    back: getCardImageUrl(card.back, 'back'),
  };
}
