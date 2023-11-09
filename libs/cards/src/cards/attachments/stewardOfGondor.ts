import { attachment } from '@card-engine-nx/state';

export const stewardOfGondor = attachment(
  {
    name: 'Steward of Gondor',
    unique: true,
    cost: 2,
    traits: ['gondor', 'title'],
    sphere: 'leadership',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gains the Gondor trait.',
    target: {
      hasAttachment: 'self',
    },
    card: {
      addTrait: 'gondor',
    },
  },
  {
    description:
      "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool.",
    action: {
      payment: {
        cost: {
          card: 'self',
          action: 'exhaust',
        },
        effect: {
          card: { hasAttachment: 'self' },
          action: {
            generateResources: 2,
          },
        },
      },
    },
  }
);
