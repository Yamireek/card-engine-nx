import { core } from '@card-engine-nx/cards/core';
import { GameEngine } from './GameEngine';

it("Gimli's attack bonus", () => {
  const game = new GameEngine();
  const gimli = game.addHero(core.hero.gimli);
  expect(gimli.props.attack).toEqual(2);
  gimli.update({ dealDamage: 1 });
  expect(gimli.props.attack).toEqual(3);
  gimli.update({ heal: 1 });
  expect(gimli.props.attack).toEqual(2);
});
