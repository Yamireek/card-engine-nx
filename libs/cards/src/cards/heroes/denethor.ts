import { hero } from '@card-engine-nx/state';

export const denethor = hero(
  {
    name: 'Denethor',
    threatCost: 8,
    willpower: 1,
    attack: 1,
    defense: 3,
    hitPoints: 3,
    traits: ['gondor', 'noble', 'steward'],
    sphere: 'lore',
  },
  {
    description:
      'Action: Exhaust Denethor to look at the top card of the encounter deck. You may move that card to the bottom of the deck.',
    action: [
      {
        card: 'self',
        action: 'exhaust',
      },
      {
        card: {
          top: 'encounterDeck',
        },
        action: { flip: 'front' },
      },
      {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Move to bottom?',
            target: {
              top: 'encounterDeck',
            },
            action: 'moveToBottom',
            optional: true,
          },
        },
      },
    ],
  }
);
