import { RandomAPI } from 'boardgame.io/dist/types/src/plugins/random/random';

export type Random = {
  shuffle: <T>(items: T[]) => T[];
  item: <T>(items: T[]) => T;
};

export function getRandomItem<T>(rnd: () => number) {
  return (items: T[]): T => {
    const index = Math.floor(rnd() * items.length);
    return items[index];
  };
}

export function shuffleItems<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }
}

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

export function rndJS(): Random {
  return {
    item<T>(items: T[]) {
      return getRandomItem<T>(Math.random)(items);
    },
    shuffle<T>(items: T[]) {
      shuffleItems(items);
      return items;
    },
  };
}

export function noRandom(): Random {
  return {
    item<T>(items: T[]) {
      return items[0];
    },
    shuffle<T>(items: T[]) {
      return items;
    },
  };
}
