import { attachment } from '@card-engine-nx/state';

export const celebriansStone = attachment(
  {
    name: "Celebrían's Stone",
    unique: true,
    cost: 2,
    traits: ['artifact', 'item'],
    sphere: 'leadership',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      'Attached hero gains +2 [willpower]. If attached hero is Aragorn, he also gains a [spirit] resource icon.',
    target: {
      hasAttachment: 'self',
    },
    card: [
      {
        increment: {
          willpower: 2,
        },
      },
      {
        if: {
          condition: {
            name: 'Aragorn',
          },
          true: {
            addSphere: 'spirit',
          },
        },
      },
    ],
  }
);
