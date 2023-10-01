import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
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
