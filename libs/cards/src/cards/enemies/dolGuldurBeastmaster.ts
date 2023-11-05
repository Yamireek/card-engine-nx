import { enemy } from '@card-engine-nx/state';

export const dolGuldurBeastmaster = enemy(
  {
    name: 'Dol Guldur Beastmaster',
    engagement: 35,
    threat: 2,
    attack: 3,
    defense: 1,
    hitPoints: 5,
    traits: ['dolGuldur', 'orc'],
  },
  {
    description:
      'Forced: When Dol Guldur Beastmaster attacks, deal it 1 additional shadow card.',
    forced: {
      event: 'attacks',
      action: {
        card: 'self',
        action: 'dealShadowCard',
      },
    },
  }
);
