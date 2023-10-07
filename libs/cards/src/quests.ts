import { quest } from '@card-engine-nx/state';

export const fliesAndSpiders = quest({
  sequence: 1,
  name: 'Flies and Spiders',
  a: {
    abilities: [
      {
        description:
          'Setup: Search the encounter deck for 1 copy of the Forest Spider and 1 copy of the Old Forest Road, and add them to the staging area. Then, shuffle the encounter deck.',
        setup: {
          sequence: [
            {
              card: {
                target: {
                  name: 'Forest Spider',
                  take: 1,
                },
                action: {
                  move: {
                    to: 'stagingArea',
                    side: 'front',
                  },
                },
              },
            },
            {
              card: {
                target: {
                  name: 'Old Forest Road',
                  take: 1,
                },
                action: {
                  move: {
                    to: 'stagingArea',
                    side: 'front',
                  },
                },
              },
            },
            'shuffleEncounterDeck',
          ],
        },
      },
    ],
  },
  b: {
    questPoints: 8,
  },
});

export const aForkInTheRoad = quest({
  sequence: 2,
  name: 'A Fork in the Road',
  a: {},
  b: {
    questPoints: 2,
    abilities: [
      {
        description:
          'Forced: When you defeat this stage, proceed to one of the 2 "A Chosen Path" stages, at random.',
        nextStage: 'random',
      },
    ],
  },
});

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
        whenRevealed: {
          sequence: [
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
                      and: [
                        { zoneType: ['encounterDeck', 'discardPile'] },
                        { trait: 'spider' },
                      ],
                    },
                    action: {
                      move: {
                        to: 'stagingArea',
                        side: 'front',
                      },
                    },
                    multi: false,
                    optional: false,
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

export const achosenPath2 = quest({
  sequence: 3,
  a: {
    name: 'A Chosen Path',
  },
  b: {
    name: "Beorn's Path",
    questPoints: 10,
    abilities: [
      {
        description:
          "Players cannot defeat this stage while Ungoliant's Spawn is in play. If players defeat this stage, they have won the game.",
        conditional: {
          advance: {
            not: {
              someCard: {
                and: ['inAPlay', { name: "Ungoliant's Spawn" }],
              },
            },
          },
        },
      },
    ],
  },
});
