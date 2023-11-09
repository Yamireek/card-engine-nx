import { enemy } from '@card-engine-nx/state';

export const blackForestBats = enemy(
  {
    name: 'Black Forest Bats',
    engagement: 15,
    threat: 1,
    attack: 1,
    defense: 0,
    hitPoints: 2,
    traits: ['creature'],
  },
  {
    description:
      'When Revealed: Each player must choose 1 character currently committed to a quest, and remove that character from the quest. (The chosen character does not ready.)',
    whenRevealed: {
      player: 'each',
      action: {
        chooseCardActions: {
          title: 'Choose character to remove from quest',
          target: {
            mark: 'questing',
          },
          action: {
            clear: 'questing',
          },
        },
      },
    },
  }
);
