import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
import { it, expect } from 'vitest';

it('Citadel plate', () => {
  const game = new TestEngine();
  const gimli = game.addHero(core.hero.gimli);
  expect(gimli.props.hitPoints).toEqual(5);
  game.addAttachment(core.attachment.citadelPlate, gimli);
  expect(gimli.props.hitPoints).toEqual(9);
});
