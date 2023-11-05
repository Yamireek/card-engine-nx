import { quest } from '@card-engine-nx/state';

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
                simple: 'inAPlay',
                name: "Ungoliant's Spawn",
              },
            },
          },
        },
      },
    ],
  },
});
