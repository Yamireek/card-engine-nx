import { event } from '@card-engine-nx/state';

export const fortuneOrFate = event(
  {
    name: 'Fortune or Fate',
    cost: 5,
    sphere: 'spirit',
  },
  {
    description:
      "Action: Choose a hero in any player's discard pile. Put that card into play, under its owner's control.",
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose hero',
          target: { type: 'hero', zoneType: 'discardPile' },
          action: {
            putInPlay: {
              controllerOf: 'target',
            },
          },
        },
      },
    },
  }
);
