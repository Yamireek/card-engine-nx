import { quest } from '@card-engine-nx/state';

export const toTheRiver = quest({
  sequence: 1,
  name: 'To the River...',
  a: {},
  b: {
    questPoints: 8,
  },
});
