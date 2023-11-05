import { event } from '@card-engine-nx/state';

export const secretPaths = event(
  {
    name: 'Secret Paths',
    cost: 1,
    sphere: 'lore',
  },
  {
    description:
      'Quest Action: Choose a location in the staging area. Until the end of the phase, that location does not contribute its [threat].',
    phase: 'quest',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose location',
          target: { type: 'location', zoneType: 'stagingArea' },
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
