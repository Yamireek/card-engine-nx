import { attachment } from '@card-engine-nx/state';

export const darkKnowledge = attachment(
  {
    name: 'Dark Knowledge',
    unique: false,
    cost: 1,
    traits: ['condition'],
    sphere: 'lore',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gets -1 [willpower]',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      willpower: -1,
    },
  },
  {
    description:
      'Response: Exhaust Dark Knowledge to look at 1 shadow card that was just dealt to an enemy attacking you.',
    action: [
      {
        card: 'self',
        action: 'exhaust',
      },
      {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose card',
            target: { side: 'back', simple: 'isShadow' },
            action: {
              flip: 'shadow',
            },
          },
        },
      },
    ],
  }
);
