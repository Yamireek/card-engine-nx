import { attachment } from '@card-engine-nx/state';

export const bladeOfGondolin = attachment(
  {
    name: 'Blade of Gondolin',
    unique: false,
    cost: 1,
    traits: ['item', 'weapon'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gets +1 Attack when attacking an Orc.',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      attack: {
        if: {
          cond: {
            and: [
              {
                card: {
                  target: 'target',
                  value: { hasMark: 'attacking' },
                },
              },
              {
                someCard: { mark: 'defending', trait: 'orc' },
              },
            ],
          },
          true: 1,
          false: 0,
        },
      },
    },
  },
  {
    description:
      'Response: After attached hero attacks and destroys an enemy, place 1 progress token on the current quest.',
    target: {
      type: 'enemy',
    },
    response: {
      event: 'destroyed',
      condition: {
        event: {
          type: 'destroyed',
          isAttacker: {
            hasAttachment: 'self',
          },
        },
      },
      action: {
        placeProgress: 1,
      },
    },
  }
);
