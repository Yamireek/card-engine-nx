import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
import { it, expect } from 'vitest';

it('Citadel plate', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            attachments: [core.attachment.citadelPlate],
          },
        ],
      },
    ],
  });

  const gimli = game.getCard('Gimli');
  expect(gimli.props.hitPoints).toEqual(9);
});

it('Dwarwen axe - dwarf', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            attachments: [core.attachment.dwarvenAxe],
          },
        ],
      },
    ],
  });

  const gimli = game.getCard('Gimli');
  expect(gimli.props.attack).toEqual(4);
});

it('Dwarwen axe - elf', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            attachments: [core.attachment.dwarvenAxe],
          },
        ],
      },
    ],
  });

  const legolas = game.getCard('Legolas');
  expect(legolas.props.attack).toEqual(4);
});

it('Blade of Gondolin', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            attachments: [core.attachment.bladeOfGondolin],
          },
        ],
        engaged: [core.enemy.dolGuldurOrcs, core.enemy.blackForestBats],
      },
    ],
  });

  const legolas = game.getCard('Legolas');
  const orc = game.getCard('Dol Guldur Orcs');
  const bats = game.getCard('Black Forest Bats');
  expect(legolas.props.attack).toEqual(3);
  legolas.update({ mark: 'attacking' });
  orc.update({ mark: 'defending' });
  bats.update({ mark: 'defending' });
  expect(legolas.props.attack).toEqual(4);
});

it('Horn of Gondor', () => {
  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            attachments: [core.attachment.hornOfGondor],
          },
          core.ally.gondorianSpearman,
        ],
      },
    ],
  });

  const legolas = game.getCard('Legolas');
  const spearman = game.getCard('Gondorian Spearman');
  expect(legolas.token.resources).toBe(0);
  spearman.update("destroy");
  console.log(game.state.players[0]?.zones);
  console.log(game.state.choice);
  game.chooseOption(
    "Response: After a character is destroyed, add 1 resource to attached hero's pool."
  );
  expect(legolas.token.resources).toBe(1);
});
