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

it('Dwarwen axe - dwarf', () => {
  const game = new TestEngine();
  const gimli = game.addHero(core.hero.gimli);
  expect(gimli.props.attack).toEqual(2);
  game.addAttachment(core.attachment.dwarvenAxe, gimli);
  expect(gimli.props.attack).toEqual(4);
});

it('Dwarwen axe - elf', () => {
  const game = new TestEngine();
  const legolas = game.addHero(core.hero.legolas);
  expect(legolas.props.attack).toEqual(3);
  game.addAttachment(core.attachment.dwarvenAxe, legolas);
  expect(legolas.props.attack).toEqual(4);
});

it('Blade of Gondolin', () => {
  const game = new TestEngine();
  const legolas = game.addHero(core.hero.legolas);
  const orc = game.addEnemy(core.enemiy.dolGuldurOrcs);
  const bats = game.addEnemy(core.enemiy.blackForestBats);
  expect(legolas.props.attack).toEqual(3);
  game.addAttachment(core.attachment.bladeOfGondolin, legolas);
  expect(legolas.props.attack).toEqual(3);
  legolas.update({ mark: 'attacking' });
  orc.update({ mark: 'defending' });
  bats.update({ mark: 'defending' });
  expect(legolas.props.attack).toEqual(4);
});