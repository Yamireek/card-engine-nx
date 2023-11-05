import { attachment } from '@card-engine-nx/state';

export const theFavorOfTheLady = attachment(
  {
    name: 'The Favor of the Lady',
    unique: false,
    cost: 2,
    traits: ['condition'],
    sphere: 'spirit',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gains +1 [willpower].',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      willpower: 1,
    },
  }
);
