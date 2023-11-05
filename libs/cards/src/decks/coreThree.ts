import * as ally from '../cards/allies';
import * as attachment from '../cards/attachments';
import * as events from '../cards/events';
import * as hero from '../cards/heroes';
import { PlayerDeck, event } from '@card-engine-nx/state';

// https://www.youtube.com/watch?v=Pyk_PrY58g8

export const testDeck: PlayerDeck = {
  name: 'Test',
  heroes: [hero.aragorn, hero.eowyn, hero.denethor, hero.legolas],
  library: [
    ally.ereborHammersmith,
    events.sneakAttack,
    event(
      { name: 'Dwarven Tomb', cost: 0, sphere: 'leadership' },
      {
        description: 'Discard ally in play',
        action: {
          card: { type: 'ally', simple: 'inAPlay' },
          action: 'discard',
        },
      }
    ),
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
