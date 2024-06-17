import { quest } from '@card-engine-nx/state';

export const outOfTheDungeons = quest({
  sequence: 3,
  name: 'Out of the Dungeons',
  a: {},
  b: {
    questPoints: 7,
  },
});
