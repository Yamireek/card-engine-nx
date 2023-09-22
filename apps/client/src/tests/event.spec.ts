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
  console.log(hero.state.modifiers)
  game.do('endPhase');
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
});
