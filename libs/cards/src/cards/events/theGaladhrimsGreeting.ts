import { event } from '@card-engine-nx/state';

export const theGaladhrimsGreeting = event(
  {
    name: "The Galadhrim's Greeting",
    cost: 3,
    sphere: 'spirit',
  },
  {
    description:
      "Action: Reduce one player's threat by 6, or reduce each player's threat by 2.",
    action: {
      player: {
        target: 'controller',
        action: {
          chooseActions: {
            title: 'Choose one',
            actions: [
              {
                title: "Reduce one player's threat by 6",
                action: {
                  player: {
                    target: 'controller',
                    action: {
                      choosePlayerActions: {
                        title: 'Choose player',
                        target: 'each',
                        action: {
                          incrementThreat: -6,
                        },
                      },
                    },
                  },
                },
              },
              {
                title: "Reduce each player's threat by 2.",
                action: {
                  player: {
                    target: 'each',
                    action: {
                      incrementThreat: -2,
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  }
);
