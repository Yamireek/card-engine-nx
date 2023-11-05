import { event } from '@card-engine-nx/state';

// TODO shuffle

export const willOfTheWest = event(
  {
    name: 'Will of the West',
    cost: 1,
    sphere: 'spirit',
  },
  {
    description:
      "Action: Choose a player. Shuffle that player's discard pile back into his deck. Remove Will of the West from the game.",
    action: [
      {
        player: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              card: {
                target: { zoneType: 'discardPile', owner: 'target' },
                action: {
                  move: {
                    side: 'back',
                    to: {
                      player: 'target',
                      type: 'library',
                    },
                  },
                },
              },
            },
          },
        },
      },
      { card: 'self', action: { move: { to: 'removed' } } },
    ],
  }
);
