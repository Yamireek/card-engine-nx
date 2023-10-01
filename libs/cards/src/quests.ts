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
  },
});
