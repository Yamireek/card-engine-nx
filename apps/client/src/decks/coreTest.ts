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
    core.hero.legolas,
    core.hero.aragorn,
    core.hero.eowyn,
    core.hero.denethor,
  ],
  library: [core.event.rainOfArrows, core.attachment.citadelPlate],
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
      easy: [],
      normal: [
        core.treachery.theNecromancersReach,
        core.enemy.dolGuldurOrcs,
        core.enemy.hummerhorns,
        core.enemy.kingSpider,
        core.location.greatForestWeb,
        core.enemy.chieftanUfthak,
        core.enemy.forestSpider,
        core.enemy.dolGuldurBeastmaster,
        core.location.mountainsOfMirkwood,
        core.enemy.dolGuldurOrcs,
        core.treachery.drivenByShadow,
        core.treachery.caughtInAWeb,
        core.treachery.theNecromancersReach,
        core.location.enchantedStream,
        core.location.oldForestRoad,
        core.enemy.blackForestBats,
        core.location.mountainsOfMirkwood,
        core.location.necromancersPass,

        core.enemy.ungoliantsSpawn,
        core.enemy.forestSpider,
        core.location.oldForestRoad,
      ],
    },
  ],
};
