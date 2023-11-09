import { event } from '@card-engine-nx/state';

export const beornsHospitality = event(
  {
    name: "Beorn's Hospitality",
    cost: 5,
    sphere: 'lore',
  },
  {
    description:
      'Action: Choose a player. Heal all damage on each hero controlled by that player.',
    action: {
      player: 'controller',
      action: {
        choosePlayerActions: {
          title: 'Choose player',
          target: 'each',
          action: {
            controlled: {
              heal: 'all',
            },
          },
        },
      },
    },
  }
);
