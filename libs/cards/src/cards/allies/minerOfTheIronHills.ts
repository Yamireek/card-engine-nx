import { ally } from '@card-engine-nx/state';

export const minerOfTheIronHills = ally(
  {
    name: 'Miner of the Iron Hills',
    cost: 2,
    willpower: 0,
    attack: 1,
    defense: 1,
    hitPoints: 2,
    traits: ['dwarf'],
    sphere: 'lore',
    unique: false,
  },
  {
    description:
      'Response: After Miner of the Iron Hills enters play, choose and discard 1 Condition attachment from play.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose attachment',
            target: { type: 'attachment', trait: 'condition' },
            action: 'discard',
          },
        },
      },
    },
  }
);
