import { quest } from '@card-engine-nx/state';

export const anduinPassage = quest({
  sequence: 2,
  name: 'Anduin Passage',
  a: {
    // Reveal 1 additional card from the encounter deck each quest phase. Do not make engagement checks during
    // the encounter phase. (Each player may still optionally engage 1 enemy each encounter phase.)
  },
  b: {
    questPoints: 16,
  },
});
