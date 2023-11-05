import { attachment } from '@card-engine-nx/state';

export const hornOfGondor = attachment(
  {
    name: 'Horn of Gondor',
    unique: true,
    cost: 1,
    traits: ['item', 'artifact'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      "Response: After a character is destroyed, add 1 resource to attached hero's pool.",
    target: 'character',
    response: {
      event: 'destroyed',
      condition: {
        card: {
          target: 'event',
          value: {
            isType: 'character',
          },
        },
      },
      action: {
        card: {
          target: {
            hasAttachment: 'self',
          },
          action: {
            generateResources: 1,
          },
        },
      },
    },
  }
);
