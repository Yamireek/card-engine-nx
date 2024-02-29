import { TestEngine } from '@card-engine-nx/engine';
import { core } from '../index';
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

it('Blade of Gondolin - bonus', () => {
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

it('Blade of Gondolin - response', async () => {
  const response =
    'Response: After attached hero attacks and destroys an enemy, place 1 progress token on the current quest.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            attachments: [core.attachment.bladeOfGondolin],
          },
        ],
        engaged: [core.enemy.dolGuldurOrcs],
      },
    ],
    activeLocation: [core.location.mountainsOfMirkwood],
  });

  const hero = game.getCard('Gimli');
  const location = game.getCard('Mountains of Mirkwood');
  const enemy = game.getCard('Dol Guldur Orcs');
  game.do({
    card: enemy.id,
    action: {
      dealDamage: {
        amount: 5,
        attackers: [hero.id],
      },
    },
  });
  game.chooseOption(response);
  expect(location.token.progress).toEqual(1);
});

it('Horn of Gondor', () => {
  const response =
    "Response: After a character is destroyed, add 1 resource to attached hero's pool.";

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
  spearman.update('destroy');
  game.chooseOption(response);
  expect(legolas.token.resources).toBe(1);
});
