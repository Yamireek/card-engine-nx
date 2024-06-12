import { it, expect } from 'vitest';
import { TestEngine } from '@card-engine-nx/engine';
import { core } from '../index';

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

  const gimli = game.card('Gimli');
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

  const gimli = game.card('Gimli');
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

  const legolas = game.card('Legolas');
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

  const legolas = game.card('Legolas');
  const orc = game.card('Dol Guldur Orcs');
  const bats = game.card('Black Forest Bats');
  expect(legolas.props.attack).toEqual(3);
  legolas.execute({ mark: 'attacking' });
  orc.execute({ mark: 'defending' });
  bats.execute({ mark: 'defending' });
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

  const hero = game.card('Gimli');
  const location = game.card('Mountains of Mirkwood');
  const enemy = game.card('Dol Guldur Orcs');
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

  const legolas = game.card('Legolas');
  const spearman = game.card('Gondorian Spearman');
  expect(legolas.token.resources).toBe(0);
  spearman.execute('destroy');
  game.chooseOption(response);
  expect(legolas.token.resources).toBe(1);
});

it('Steward of Gondor', () => {
  const action =
    "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool.";

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            attachments: [core.attachment.stewardOfGondor],
          },
        ],
      },
    ],
  });

  const legolas = game.card('Legolas');
  expect(legolas.token.resources).toBe(0);
  game.chooseAction(action);
  expect(legolas.token.resources).toBe(2);
  expect(game.actions).toHaveLength(0);
});
