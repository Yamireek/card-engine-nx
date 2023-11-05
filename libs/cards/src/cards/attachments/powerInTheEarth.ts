import { attachment } from '@card-engine-nx/state';

export const powerInTheEarth = attachment(
  {
    name: 'Power in the Earth',
    unique: false,
    cost: 1,
    traits: ['condition'],
    sphere: 'spirit',
  },
  {
    description: 'Attach to a location.',
    attachesTo: { type: 'location' },
  },
  {
    description: 'Attached location gets -1 [threat]',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      threat: -1,
    },
  }
);
