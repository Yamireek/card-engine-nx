import { Side } from '@card-engine-nx/basic';
import { CardDefinition, PrintedProps } from '@card-engine-nx/state';
import { image } from '.';

export type CardImageUrls = { front: string; back: string };

export function getCardImageUrl(
  props: PrintedProps,
  side: Side,
  frontName?: string
): string {
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
    } - ${name}.jpg`;
  }

  const name = side === 'shadow' ? frontName : props.name || props.type;
  return `./images/cards/01-core/${name}.jpg`;
}

export function getCardImageUrls(card: CardDefinition): CardImageUrls {
  return {
    front: getCardImageUrl(card.front, 'front'),
    back: getCardImageUrl(card.back, 'back'),
  };
}
