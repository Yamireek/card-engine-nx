import { attachment } from '@card-engine-nx/state';

export const dwarvenAxe = attachment(
  {
    name: 'Dwarven Axe',
    unique: false,
    cost: 2,
    traits: ['item', 'weapon'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      'Attached hero gains +1 ATT (+2 ATT instead if attached hero is a Dwarf.)',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      attack: {
        if: {
          cond: {
            card: {
              target: 'target',
              value: { hasTrait: 'dwarf' },
            },
          },
          true: 2,
          false: 1,
        },
      },
    },
  }
);
