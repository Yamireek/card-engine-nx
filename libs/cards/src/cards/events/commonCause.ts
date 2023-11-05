import { event } from '@card-engine-nx/state';

// TODO fix

export const commonCause = event(
  {
    name: 'Common Cause',
    cost: 0,
    sphere: 'leadership',
  },
  {
    description:
      'Action: Exhaust 1 hero you control to choose and ready a different hero.',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose hero to exhaust',
            target: { type: 'hero', controller: 'controller' },
            action: [
              {
                action: {
                  useScope: {
                    var: 'exhaused',
                    card: 'target',
                  },
                  action: {
                    player: {
                      target: 'controller',
                      action: {
                        chooseCardActions: {
                          title: 'Choose hero to ready',
                          target: { type: 'hero', not: { var: 'exhausted' } },
                          action: 'ready',
                        },
                      },
                    },
                  },
                },
              },
              'exhaust',
            ],
          },
        },
      },
    },
  }
);
