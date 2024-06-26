import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';
import { Random, getRandomItem } from '@card-engine-nx/basic';

export function randomBgIO(random: RandomAPI): Random {
  return {
    item<T>(items: T[]) {
      return getRandomItem<T>(random.Number)(items);
    },
    shuffle(items) {
      return random.Shuffle(items);
    },
  };
}
