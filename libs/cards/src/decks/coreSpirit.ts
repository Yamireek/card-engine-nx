import { PlayerDeck } from '@card-engine-nx/state';
import * as ally from '../cards/allies';
import * as attachment from '../cards/attachments';
import * as event from '../cards/events';
import * as hero from '../cards/heroes';

export const coreSpirit: PlayerDeck = {
  name: 'Core (Spirit)',
  heroes: [hero.eowyn, hero.eleanor, hero.dunhere],
  library: [
    ally.wanderingTook,
    ally.wanderingTook,
    ally.lorienGuide,
    ally.lorienGuide,
    ally.lorienGuide,
    ally.northernTracker,
    ally.northernTracker,
    event.theGaladhrimsGreeting,
    event.theGaladhrimsGreeting,
    event.strengthOfWill,
    event.strengthOfWill,
    event.hastyStroke,
    event.hastyStroke,
    event.willOfTheWest,
    event.willOfTheWest,
    event.aTestOfWill,
    event.aTestOfWill,
    event.standAndFight,
    event.standAndFight,
    event.standAndFight,
    event.aLightInIheDark,
    event.aLightInIheDark,
    event.dwarvenTomb,
    event.fortuneOrFate,
    attachment.theFavorOfTheLady,
    attachment.theFavorOfTheLady,
    attachment.powerInTheEarth,
    attachment.powerInTheEarth,
    attachment.unexpectedCourage,
    ally.gandalf,
    ally.gandalf,
    ally.gandalf,
  ],
};
