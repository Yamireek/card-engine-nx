import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreSpirit: PlayerDeck = {
  name: 'Core (Tactics)',
  heroes: [core.hero.eowyn, core.hero.eleanor, core.hero.dunhere],
  library: [],
};
