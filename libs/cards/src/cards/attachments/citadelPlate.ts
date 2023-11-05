import { attachment } from '@card-engine-nx/state';

export const citadelPlate = attachment(
  {
    name: 'Citadel Plate',
    unique: false,
    cost: 4,
    traits: ['item', 'armor'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gets +4 Hit Points.',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      hitPoints: 4,
    },
  }
);
