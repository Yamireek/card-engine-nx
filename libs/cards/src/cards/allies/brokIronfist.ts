import { ally } from '@card-engine-nx/state';

export const brokIronfist = ally(
  {
    name: 'Brok Ironfist',
    cost: 6,
    willpower: 2,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['dwarf', 'warrior'],
    sphere: 'leadership',
    unique: true,
  },
  {
    description:
      'Response: After a Dwarf hero you control leaves play, put Brok Ironfist into play from your hand.',
    zone: 'hand',
    target: {
      type: 'hero',
      trait: 'dwarf',
      controller: 'controller',
    },
    response: {
      event: 'leftPlay',
      action: {
        card: 'self',
        action: {
          putInPlay: 'controller',
        },
      },
    },
  }
);
