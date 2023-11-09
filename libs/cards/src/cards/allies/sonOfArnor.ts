import { ally } from '@card-engine-nx/state';

export const sonOfArnor = ally(
  {
    name: 'Son of Arnor',
    cost: 3,
    willpower: 0,
    attack: 2,
    defense: 0,
    hitPoints: 2,
    traits: ['dúnedain'],
    sphere: 'leadership',
    unique: false,
  },
  {
    description:
      'Response: After Son of Arnor enters play, choose an enemy card in the staging area or currently engaged with another player. Engage that enemy.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose enemy to engage',
            target: { type: 'enemy' },
            action: { engagePlayer: 'controller' },
          },
        },
      },
    },
  }
);
