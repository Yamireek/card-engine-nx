import { TestEngine } from '@card-engine-nx/engine';
import { core } from './index';
import { it, expect } from 'vitest';

it('Flies and Spiders', () => {
  const game = new TestEngine({
    players: [{ playerArea: [core.hero.gimli] }],
    questArea: [core.quest.fliesAndSpiders],
    encounterDeck: [core.enemy.forestSpider, core.location.oldForestRoad],
  });

  game.do('setup');
  expect(game.state.zones.stagingArea.cards).toHaveLength(2);
});

it('A Fork in the Road', () => {
  const game = new TestEngine({
    players: [{ playerArea: [core.hero.gimli] }],
    questArea: [core.quest.aForkInTheRoad],
    questDeck: [core.quest.achosenPath1, core.quest.achosenPath2],
  });

  const quest = game.getCard('A Fork in the Road');
  quest.update({ flip: 'back' });
  game.do({ placeProgress: 2 });
});

it("Don't Leave the Path!", () => {
  const game = new TestEngine({
    players: [{ playerArea: [core.hero.gimli] }],
    encounterDeck: [core.enemy.ungoliantsSpawn],
    questArea: [core.quest.aForkInTheRoad],
    questDeck: [core.quest.achosenPath1],
  });

  const quest = game.getCard('A Fork in the Road');
  const spawn = game.getCard("Ungoliant's Spawn");
  quest.update({ flip: 'back' });
  game.do({ placeProgress: 2 });
  expect(game.state.result).toBeUndefined();
  spawn.update('destroy');
  expect(game.state.result?.win).toBeTruthy();
});

it("Beorn's Path", () => {
  const game = new TestEngine({
    players: [
      { playerArea: [core.hero.gimli], engaged: [core.enemy.ungoliantsSpawn] },
    ],
    questArea: [core.quest.achosenPath2],
  });

  const quest = game.getCard('A Chosen Path');
  const spawn = game.getCard("Ungoliant's Spawn");
  quest.update({ flip: 'back' });
  game.do({ placeProgress: 20 });
  expect(game.state.result).toBeUndefined();
  spawn.update('destroy');
  expect(game.state.result?.win).toBeTruthy();
});
