import { ally } from '@card-engine-nx/state';

export const ereborHammersmith = ally(
  {
    name: 'Erebor Hammersmith',
    cost: 2,
    willpower: 1,
    attack: 1,
    defense: 1,
    hitPoints: 3,
    traits: ['dwarf', 'craftsman'],
    sphere: 'lore',
    unique: false,
  },
  {
    description:
      "Response: After you play Erebor Hammersmith, return the topmost attachment in any player's discard pile to his hand.",
    target: 'self',
    response: {
      event: 'played',
      action: {
        player: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              card: {
                target: {
                  top: {
                    amount: 1,
                    filter: { type: 'attachment' },
                    zone: {
                      player: 'target',
                      type: 'discardPile',
                    },
                  },
                },
                action: {
                  move: {
                    to: {
                      player: 'target',
                      type: 'hand',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }
);
