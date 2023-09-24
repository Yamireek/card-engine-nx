import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
import { it, expect } from 'vitest';

it('Blade Mastery', () => {
  const game = new TestEngine();
  const hero = game.addHero(core.hero.gimli);
  hero.update({ generateResources: 1 });
  expect(hero.token.resources).toEqual(1);
  game.addToHand(core.event.bladeMastery);
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
  game.chooseAction(
    'Action: Choose a character. Until the end of the phase, that character gains +1 Attack and +1 Defense.'
  );
  expect(hero.props.attack).toEqual(3);
  expect(hero.props.defense).toEqual(3);
  console.log(hero.state.modifiers);
  game.do('endPhase');
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
});

it('Feint', () => {
  const game = new TestEngine();
  const hero = game.addHero(core.hero.legolas);
  hero.update({ generateResources: 1 });
  game.addEnemy(core.enemiy.dolGuldurOrcs);
  game.addToHand(core.event.feint);
  expect(game.actions.length).toBe(0);
  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    'Combat Action: Choose an enemy engaged with a player. That enemy cannot attack that player this phase.'
  );
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice).toBeUndefined();
  game.do('endPhase');
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice?.title).toBe('Declare defender');
});

it('Rain of Arrows', () => {
  const game = new TestEngine();
  const hero = game.addHero(core.hero.legolas);
  hero.update({ generateResources: 1 });
  const enemy1 = game.addEnemy(core.enemiy.dolGuldurOrcs);
  const enemy2 = game.addEnemy(core.enemiy.kingSpider);
  game.addToHand(core.event.rainOfArrows);
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    'Action: Exhaust a character you control with the ranged keyword to choose a player. Deal 1 damage to each enemy engaged with that player.'
  );
  expect(enemy1.state.token.damage).toBe(1);
  expect(enemy2.state.token.damage).toBe(1);
});

it('Thicket of Spears', () => {
  const game = new TestEngine();
  const legolas = game.addHero(core.hero.legolas);
  const gimli = game.addHero(core.hero.gimli);
  const thalin = game.addHero(core.hero.thalin);
  legolas.update({ generateResources: 1 });
  gimli.update({ generateResources: 1 });
  thalin.update({ generateResources: 1 });
  game.addEnemy(core.enemiy.dolGuldurOrcs);
  game.addToHand(core.event.thicketOfSpears);
  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(
    "You must use resources from 3 different heroes' pools to pay for this card. Action: Choose a player. That player's engaged enemies cannot attack that player this phase."
  );
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice).toBeUndefined();
  game.do('endPhase');
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  expect(game.state.choice?.title).toBe('Declare defender');
});
