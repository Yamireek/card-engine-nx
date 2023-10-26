import * as ally from '../allies';
import * as attachment from '../attachments';
import * as events from '../events';
import * as hero from '../heroes';
import { PlayerDeck, event } from '@card-engine-nx/state';

// https://www.youtube.com/watch?v=Pyk_PrY58g8

export const testDeck: PlayerDeck = {
  name: 'Test',
  heroes: [hero.aragorn, hero.eowyn, hero.denethor, hero.legolas],
  library: [
    events.gandalfsSearch,
    events.gandalfsSearch,
    events.gandalfsSearch,
    events.gandalfsSearch,
    ally.silverlodeArcher,
    ally.veteranAxehand,
    ally.beorn,
    ally.brokIronfist,
    ally.gondorianSpearman,
    ally.gleowine,
    ally.lorienGuide,
    ally.faramir,
    // event(
    //   { name: 'Dwarven Tomb', cost: 0, sphere: 'leadership' },
    //   {
    //     description: 'Discard alies in play',
    //     action: { card: { type: 'ally' }, action: 'discard' },
    //   }
    // ),
  ],
};

export const coreThree: PlayerDeck = {
  name: 'Core (Three spheres)',
  heroes: [hero.theodred, hero.eowyn, hero.denethor],
  library: [
    attachment.stewardOfGondor,
    ally.gleowine,
    ally.henamarthRiversong,
    ally.minerOfTheIronHills,
    events.valiantSacrifice,
    ally.snowbournScout,
    events.sneakAttack,
    events.secretPaths,
    ally.guardOfTheCitadel,
    events.secretPaths,
    attachment.darkKnowledge,
    ally.faramir,
    ally.wanderingTook,
    events.loriensWealth,
    events.radagastsCunning,
    events.aTestOfWill,
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
    events.aTestOfWill,
    events.loriensWealth,
    events.radagastsCunning,
    events.sneakAttack,
    events.standAndFight,
    events.standAndFight,
    events.theGaladhrimsGreeting,
    events.theGaladhrimsGreeting,
    events.valiantSacrifice,
  ],
};
