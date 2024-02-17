import { attachment } from '@card-engine-nx/state';

export const forestSnare = attachment(
  {
    name: 'Forest Snare',
    unique: false,
    cost: 3,
    traits: ['item', 'trap'],
    sphere: 'lore',
  },
  {
    description: 'Attach to an enemy engaged with a player.',
    attachesTo: { type: 'enemy', zoneType: 'engaged' },
  },
  {
    description: 'Attached enemy cannot attack.',
    target: {
      hasAttachment: 'self',
    },
    card: {
      rules: {
        cantAttack: true,
      },
    },
  }
);
