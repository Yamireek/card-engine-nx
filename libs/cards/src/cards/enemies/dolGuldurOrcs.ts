import { enemy } from '@card-engine-nx/state';

export const dolGuldurOrcs = enemy(
  {
    name: 'Dol Guldur Orcs',
    engagement: 10,
    threat: 2,
    attack: 2,
    defense: 0,
    hitPoints: 3,
    traits: ['dolGuldur', 'orc'],
  },
  {
    description:
      'When Revealed: The first player chooses 1 character currently committed to a quest. Deal 2 damage to that character.',
    whenRevealed: {
      player: {
        target: 'first',
        action: {
          chooseCardActions: {
            title: 'Choose character for 2 damage',
            target: { mark: 'questing' },
            action: {
              dealDamage: 2,
            },
          },
        },
      },
    },
  },
  {
    description:
      'Shadow: Attacking enemy gets +1 Attack (+3 Attack instead if this attack is undefended.)',
    shadow: {
      card: {
        hasShadow: 'self',
      },
      action: {
        modify: {
          increment: {
            attack: {
              if: {
                cond: 'undefended.attack',
                true: 3,
                false: 1,
              },
            },
          },
        },
      },
    },
  }
);
