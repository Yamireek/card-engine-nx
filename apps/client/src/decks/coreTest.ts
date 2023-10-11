import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreTest: PlayerDeck = {
  name: 'Test',
  heroes: [
    core.hero.gimli,
    // core.hero.aragorn,
    // core.hero.eowyn,
    // core.hero.denethor,
  ],
  library: [
    // core.ally.faramir,
    // core.ally.gondorianSpearman,
    // core.ally.gandalf,
    // core.ally.sonOfArnor,
    // core.ally.snowbournScout,
    // core.ally.longbeardOrcSlayer,
    core.ally.brokIronfist,
  ],
};
