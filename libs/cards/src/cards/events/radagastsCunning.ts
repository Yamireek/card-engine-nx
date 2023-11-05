import { event } from '@card-engine-nx/state';

export const radagastsCunning = event(
  {
    name: "Radagast's Cunning",
    cost: 1,
    sphere: 'lore',
  },
  {
    description:
      'Quest Action: Choose an enemy in the staging area. Until the end of the phase, that enemy does not contribute its [threat].',
    phase: 'quest',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose location',
          target: { type: 'enemy', zoneType: 'stagingArea' },
          action: {
            modify: {
              rule: {
                noThreatContribution: true,
              },
            },
            until: 'end_of_phase',
          },
        },
      },
    },
  }
);
