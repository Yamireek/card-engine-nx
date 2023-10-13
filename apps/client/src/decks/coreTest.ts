import { core } from '@card-engine-nx/cards';
import { PlayerDeck, Scenario, event } from '@card-engine-nx/state';

export const discardTargetCard = event(
  {
    cost: 0,
    name: 'A Test of Will',
    sphere: 'neutral',
  },
  {
    description: 'Discard target card',
    action: {
      player: '0',
      action: {
        chooseCardActions: {
          title: 'Choose card',
          target: { zoneType: 'playerArea' },
          action: 'discard',
        },
      },
    },
  }
);

export const coreTest: PlayerDeck = {
  name: 'Test',
  heroes: [
    core.hero.gimli,
    core.hero.aragorn,
    core.hero.eowyn,
    core.hero.denethor,
  ],
  library: [
    core.event.willOfTheWest,
    core.event.willOfTheWest,
    core.event.willOfTheWest,
    core.event.willOfTheWest,
    core.event.willOfTheWest,
    discardTargetCard,
    discardTargetCard,
    discardTargetCard,
    discardTargetCard,
    discardTargetCard,
  ],
};

export const testScenario: Scenario = {
  name: 'Test',
  quest: [
    core.quest.fliesAndSpiders,
    core.quest.aForkInTheRoad,
    core.quest.achosenPath1,
    core.quest.achosenPath2,
  ],
  sets: [
    {
      easy: [core.treachery.caughtInAWeb],
      normal: [],
    },
  ],
};
