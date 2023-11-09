import { hero } from '@card-engine-nx/state';

export const glorfindel = hero(
  {
    name: 'Glorfindel',
    threatCost: 12,
    willpower: 3,
    attack: 3,
    defense: 1,
    hitPoints: 5,
    traits: ['noble', 'noldor', 'warrior'],
    sphere: 'lore',
  },
  {
    description:
      "Pay 1 resource from Glorfindel's pool to heal 1 damage on any character. (Limit once per round.)",
    limit: {
      max: 1,
      type: 'round',
    },
    action: {
      payment: {
        cost: { card: 'self', action: { payResources: 1 } },
        effect: {
          player: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose character to heal',
              target: 'character',
              action: { heal: 1 },
            },
          },
        },
      },
    },
  }
);
