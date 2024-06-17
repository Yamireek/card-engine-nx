import { quest } from '@card-engine-nx/state';

export const throughTheCaverns = quest({
  sequence: 2,
  name: 'Through the Caverns',
  a: {},
  b: {
    questPoints: 15,
  },
});
