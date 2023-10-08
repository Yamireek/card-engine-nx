import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreLeadership: PlayerDeck = {
  name: 'Core (Tactics)',
  heroes: [core.hero.aragorn, core.hero.theodred, core.hero.gloin],
  library: [],
};
