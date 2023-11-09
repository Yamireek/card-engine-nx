import { location } from '@card-engine-nx/state';

export const mountainsOfMirkwood = location(
  {
    name: 'Mountains of Mirkwood',
    threat: 2,
    questPoints: 3,
    traits: ['forest', 'mountain'],
  },
  {
    description:
      'Travel: Reveal the top card of the encounter deck and add it to the staging area to travel here.',
    travel: {
      card: {
        top: 'encounterDeck',
      },
      action: 'reveal',
    },
  },
  {
    description:
      "Response: After Mountains of Mirkwood leaves play as an explored location, each player may search the top 5 cards of his deck for 1 card and add it to his hand. Shuffle the rest of the searched cards back into their owners' decks.",
    target: 'self',
    response: {
      event: 'explored',
      action: {
        player: 'each',
        action: [
          {
            deck: { flip: 'front' },
          },
          {
            chooseCardActions: {
              title: 'Choose card to draw',
              target: {
                top: {
                  amount: 5,
                  zone: {
                    player: 'target',
                    type: 'library',
                  },
                },
              },
              action: 'draw',
            },
          },
          {
            deck: { flip: 'back' },
          },
          'shuffleLibrary',
        ],
      },
    },
  }
);
