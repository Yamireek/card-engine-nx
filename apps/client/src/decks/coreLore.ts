import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreLore: PlayerDeck = {
  name: 'Core (Tactics)',
  heroes: [core.hero.denethor, core.hero.glorfindel, core.hero.beravor],
  library: [],
};
