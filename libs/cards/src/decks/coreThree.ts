import * as ally from '../allies';
import * as attachment from '../attachments';
import * as event from '../events';
import * as hero from '../heroes';
import { PlayerDeck } from '@card-engine-nx/state';

// https://www.youtube.com/watch?v=Pyk_PrY58g8

export const testDeck: PlayerDeck = {
  name: 'Test',
  heroes: [hero.aragorn, hero.eowyn, hero.denethor, hero.legolas],
  library: [event.radagastsCunning, event.secretPaths],
};

export const coreThree: PlayerDeck = {
  name: 'Core (Three spheres)',
  heroes: [hero.theodred, hero.eowyn, hero.denethor],
  library: [
    attachment.stewardOfGondor,
    ally.gleowine,
    ally.henamarthRiversong,
    ally.minerOfTheIronHills,
    event.valiantSacrifice,
    ally.snowbournScout,
    event.sneakAttack,
    event.secretPaths,
    ally.guardOfTheCitadel,
    event.secretPaths,
    attachment.darkKnowledge,
    ally.faramir,
    ally.wanderingTook,
    event.loriensWealth,
    event.radagastsCunning,
    event.aTestOfWill,
    ally.guardOfTheCitadel,
    ally.lorienGuide,
    ally.gandalf,
    ally.ereborHammersmith,

    ally.daughterOfTheNimrodel,
    ally.daughterOfTheNimrodel,
    ally.ereborHammersmith,
    ally.faramir,
    ally.gandalf,
    ally.gandalf,
    ally.gleowine,
    ally.guardOfTheCitadel,
    ally.lorienGuide,
    ally.lorienGuide,
    ally.minerOfTheIronHills,
    ally.northernTracker,
    ally.northernTracker,
    ally.snowbournScout,
    ally.snowbournScout,
    ally.wanderingTook,
    attachment.celebriansStone,
    attachment.stewardOfGondor,
    attachment.theFavorOfTheLady,
    attachment.theFavorOfTheLady,
    attachment.unexpectedCourage,
    event.aTestOfWill,
    event.loriensWealth,
    event.radagastsCunning,
    event.sneakAttack,
    event.standAndFight,
    event.standAndFight,
    event.theGaladhrimsGreeting,
    event.theGaladhrimsGreeting,
    event.valiantSacrifice,
  ],
};
