import { enemy } from '@card-engine-nx/state';

export const hummerhorns = enemy(
  {
    name: 'Hummerhorns',
    engagement: 40,
    threat: 1,
    attack: 2,
    defense: 0,
    hitPoints: 3,
    victory: 5,
    traits: ['creature', 'insect'],
  },
  {
    description:
      'Forced: After Hummerhorns engages you, deal 5 damage to a single hero you control.',
    target: 'self',
    forced: {
      event: 'engaged',
      action: {
        player: 'event',
        action: {
          chooseCardActions: {
            title: 'Choose hero to deal 5 damage',
            target: { type: 'hero', controller: 'event' },
            action: {
              dealDamage: 5,
            },
          },
        },
      },
    },
  },
  {
    description:
      'Shadow: Deal 1 damage to each character the defending player controls. (2 damage instead if this attack is undefended.)',
    shadow: {
      card: {
        controller: 'defending',
      },
      action: {
        dealDamage: {
          amount: {
            if: {
              cond: 'undefended.attack',
              true: 2,
              false: 1,
            },
          },
        },
      },
    },
  }
);
