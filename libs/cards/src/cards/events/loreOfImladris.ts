import { event } from '@card-engine-nx/state';

export const loreOfImladris = event(
  {
    name: 'Lore of Imladris',
    cost: 2,
    sphere: 'lore',
  },
  {
    description:
      'Action: Choose a character. Heal all damage from that character.',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose character to heal',
          target: 'character',
          action: {
            heal: 'all',
          },
        },
      },
    },
  }
);
