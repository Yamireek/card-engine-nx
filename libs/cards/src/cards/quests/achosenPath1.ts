import { quest } from '@card-engine-nx/state';

export const achosenPath1 = quest({
  sequence: 3,
  a: {
    name: 'A Chosen Path',
  },
  b: {
    name: "Don't Leave the Path!",
    questPoints: 0,
    abilities: [
      {
        description:
          'When Revealed: Each player must search the encounter deck and discard pile for 1 Spider card of his choice, and add it to the staging area.',
        whenRevealed: [
          {
            card: {
              target: { zoneType: 'encounterDeck' },
              action: {
                flip: 'front',
              },
            },
          },
          {
            player: {
              target: 'each',
              action: {
                chooseCardActions: {
                  title: 'Choose 1 Spider',
                  target: {
                    zoneType: ['encounterDeck', 'discardPile'],
                    trait: 'spider',
                  },
                  action: {
                    move: {
                      to: 'stagingArea',
                    },
                  },
                },
              },
            },
          },
          {
            card: {
              target: { zoneType: 'encounterDeck' },
              action: {
                flip: 'back',
              },
            },
          },
          'shuffleEncounterDeck',
        ],
      },
      {
        description:
          "The players must find and defeat Ungoliant's Spawn to win this game.",
        multi: [
          {
            description: '',
            conditional: {
              advance: false,
            },
          },
          {
            description: '',
            target: {
              name: "Ungoliant's Spawn",
            },
            forced: {
              event: 'destroyed',
              action: 'win',
            },
          },
        ],
      },
    ],
  },
});
