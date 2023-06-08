import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';

it("Gimli's attack bonus", () => {
  const game = new TestEngine();
  const gimli = game.addHero(core.hero.gimli);
  expect(gimli.props.attack).toEqual(2);
  gimli.update({ dealDamage: 1 });
  expect(gimli.props.attack).toEqual(3);
  gimli.update({ heal: 1 });
  expect(gimli.props.attack).toEqual(2);
});
