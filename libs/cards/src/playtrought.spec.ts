import { TestEngine, beginScenario } from '@card-engine-nx/engine';
import { coreThree } from '../../../apps/client/src/decks/coreThree';
import { Scenario } from '@card-engine-nx/state';
import { core } from '@card-engine-nx/cards';
import { it } from 'vitest';

const testScenario: Scenario = {
  name: 'Test',
  quest: [
    core.quest.fliesAndSpiders,
    core.quest.aForkInTheRoad,
    core.quest.achosenPath1,
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

it('Plays', () => {
  const game = new TestEngine({
    players: [],
  });
  game.do({ addPlayer: coreThree });
  game.do(beginScenario(testScenario, 'normal'));
  game.skip();
  game.chooseAction('Play ally Henamarth Riversong');
  game.skip();
  game.chooseOptions(['1', '2', '3', '51']);
  game.chooseOption(
    "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
  );
  game.chooseOption('3');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('54');
  game.chooseOption(
    'Response: After you travel to Old Forest Road the first player may choose and ready 1 character he controls.'
  );
  game.chooseOption('3');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('3');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseAction('Play attachment Steward of Gondor');
  game.chooseOption('3');
  game.chooseAction(
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
  );
  game.chooseAction('Play ally Gléowine');
  game.chooseAction(
    'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
  );
  game.chooseAction('Play ally Miner of the Iron Hills');
  game.skip();
  game.chooseOptions(['1', '2']);
  game.chooseOption(
    "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
  );
  game.chooseOption('1');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('3');
  game.skip();
  game.skip();
  game.skip();
  game.chooseAction(
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
  );
  game.chooseAction(
    'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
  );
  game.skip();
  game.chooseAction('Play attachment Dark Knowledge');
  game.chooseOption('3');
  game.chooseAction('Play ally Guard of the Citadel');
  game.skip();
  game.chooseOptions(['1', '2']);
  game.chooseOption(
    "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
  );
  game.chooseOption('1');
  game.skip();
  game.chooseAction(
    'Quest Action: Choose a location in the staging area. Until the end of the phase, that location does not contribute its [threat].'
  );
  game.skip();
  game.skip();
  game.chooseOption('70');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('50');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseAction(
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
  );
  game.chooseAction(
    'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
  );
  game.chooseAction('Play ally Wandering Took');
  game.skip();
  game.chooseOptions(['1', '2']);
  game.chooseOption(
    "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
  );
  game.chooseOption('1');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('68');
  game.skip();
  game.chooseOption('3');
  game.skip();
  game.chooseOption('41');
  game.skip();
  game.chooseOption('55');
  game.skip();
  game.chooseOptions(['45', '50']);
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseAction(
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
  );
  game.chooseAction(
    'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
  );
  game.chooseAction('Action: Choose a player. That player draws 3 cards.');
  game.chooseAction('Play ally Lórien Guide');
  game.chooseAction('Play ally Faramir');
  game.skip();
  game.chooseOptions(['1', '2']);
  game.chooseOption(
    "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
  );
  game.chooseOption('2');
  game.skip();
  game.chooseOption(
    'Response: Cancel the “when revealed” effects of a card that was just revealed from the encounter deck.'
  );
  game.skip();
  game.chooseOption('56');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('55');
  game.skip();
  game.chooseOption('42');
  game.chooseOption('68');
  game.skip();
  game.chooseOption('3');
  game.skip();
  game.chooseOption('50');
  game.skip();
  game.chooseOption('65');
  game.skip();
  game.chooseOptions(['36', '41', '45']);
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseAction(
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
  );
  game.chooseAction(
    'Action: Exhaust Gléowine to choose a player. That player draws 1 card.'
  );
  game.chooseAction('Play ally Erebor Hammersmith');
  game.skip();
  game.chooseOptions(['1', '2']);
  game.chooseOption(
    "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool."
  );
  game.chooseOption('1');
  game.skip();
  game.chooseAction(
    'Quest Action: Choose a location in the staging area. Until the end of the phase, that location does not contribute its [threat].'
  );
  game.skip();
  game.skip();
  game.chooseOption('61');
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseOption('55');
  game.skip();
  game.chooseOption('3');
  game.skip();
  game.chooseOption('42');
  game.chooseAction(
    'Action: Put 1 ally card into play from your hand. At the end of the phase, if that ally is still in play, return it to your hand.'
  );
  game.chooseOption('35');
  game.chooseOption(
    'Response: After Gandalf enters play, (choose 1): draw 3 cards, deal 4 damage to 1 enemy in play, or reduce your threat by 5.'
  );
  game.chooseOption('Deal 4 damage to 1 enemy in play');
  game.chooseOption('56');
  game.skip();
  game.chooseOption('55');
  game.skip();
  game.chooseOption('35');
  game.skip();
  game.skip();
  game.chooseOptions(['34', '36', '41', '45', '50']);
  game.skip();
  game.skip();
  game.skip();
  game.skip();
  game.chooseAction('Play ally Snowbourn Scout');
  game.chooseOption(
    'Response: After Snowbourn Scout enters play, choose a location. Place 1 progress token on that location.'
  );
  game.chooseAction(
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool."
  );
  game.chooseAction('Play ally Gandalf');
});
