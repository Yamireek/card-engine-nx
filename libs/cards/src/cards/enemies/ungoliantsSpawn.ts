import { enemy } from '@card-engine-nx/state';

export const ungoliantsSpawn = enemy(
  {
    name: "Ungoliant's Spawn",
    engagement: 32,
    threat: 3,
    attack: 5,
    defense: 2,
    hitPoints: 9,
    traits: ['creature', 'spider'],
  },
  {
    description:
      'When Revealed: Each character currently committed to a quest gets -1 Willpower until the end of the phase.',
    whenRevealed: {
      card: {
        mark: 'questing',
      },
      action: {
        modify: {
          increment: {
            willpower: -1,
          },
        },
        until: 'end_of_phase',
      },
    },
  },
  {
    description:
      "Shadow: Raise defending player's threat by 4. (Raise defending player's threat by 8 instead if this attack is undefended.)",
    shadow: {
      player: 'defending',
      action: {
        incrementThreat: {
          if: {
            cond: 'undefended.attack',
            true: 8,
            false: 4,
          },
        },
      },
    },
  }
);
