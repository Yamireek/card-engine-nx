import { ally } from '@card-engine-nx/state';

export const wanderingTook = ally(
  {
    name: 'Wandering Took',
    cost: 2,
    willpower: 1,
    attack: 1,
    defense: 1,
    hitPoints: 2,
    traits: ['hobbit'],
    sphere: 'spirit',
    unique: false,
  },
  {
    description:
      "Action: Reduce your threat by 3 to give control of Wandering Took to another player. Raise that player's threat by 3. (Limit once per round.)",
    limit: { type: 'round', max: 1 },
    action: {
      player: 'controller',
      action: [
        { incrementThreat: -3 },
        {
          choosePlayerActions: {
            title: 'Choose player',
            target: { not: 'controller' },
            action: [
              { incrementThreat: 3 },
              {
                card: {
                  target: 'self',
                  action: [
                    {
                      move: {
                        to: {
                          player: 'target',
                          type: 'playerArea',
                        },
                      },
                    },
                    {
                      setController: 'target',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
);
