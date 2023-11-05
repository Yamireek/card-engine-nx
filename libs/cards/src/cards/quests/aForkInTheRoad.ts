import { quest } from '@card-engine-nx/state';

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
