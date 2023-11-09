import { treachery } from '@card-engine-nx/state';

export const theNecromancersReach = treachery(
  {
    name: "The Necromancer's Reach",
  },
  {
    description: 'When Revealed: Deal 1 damage to each exhausted character.',
    whenRevealed: {
      card: { simple: ['character', 'exhausted'] },
      action: {
        dealDamage: 1,
      },
    },
  }
);
