import { core } from '@card-engine-nx/cards';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreTest: PlayerDeck = {
  name: 'Test',
  heroes: [
    core.hero.gimli,
    core.hero.aragorn,
    core.hero.eowyn,
    core.hero.denethor,
  ],
  library: [
    core.event.everVigilant,
    core.event.commonCause,
    core.event.forGondor,
    core.event.sneakAttack,
    core.event.valiantSacrifice,
    core.event.grimResolve,
    core.event.theGaladhrimsGreeting,
    core.event.strengthOfWill,
    core.event.aTestOfWill,
    core.event.aLightInIheDark,
    core.event.dwarvenTomb,
    core.event.fortuneOrFate,
    core.event.loriensWealth,
    core.event.beornsHospitality
  ],
};
