import { PrintedProps } from '@card-engine-nx/basic';
import { image } from '..';

export function getCardImageUrl(props: PrintedProps): string {
  if (props.type === 'player_back') {
    return image.playerBack;
  }

  if (props.type === 'encounter_back') {
    return image.encounterBack;
  }

  const name = props.name || props.type;
  return `./images/cards/01-core/${name.replace("'", '_')}.jpg`;
}
