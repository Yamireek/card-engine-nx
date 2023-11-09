import { attachment } from '@card-engine-nx/state';

export const protectorOfLorien = attachment(
  {
    name: 'Protector of Lórien',
    unique: false,
    cost: 1,
    traits: ['title'],
    sphere: 'lore',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      'Action: Discard a card from your hand to give attached hero +1 [defense] or +1 [willpower] until the end of the phase. Limit 3 times per phase.',
    limit: {
      max: 3,
      type: 'phase',
    },
    action: {
      payment: {
        cost: {
          player: 'controller',
          action: {
            discard: {
              target: 'choice',
              amount: 1,
            },
          },
        },
        effect: {
          player: 'controller',
          action: {
            chooseActions: {
              title: 'Choose bonus',
              actions: [
                {
                  title: '+1 [defense]',
                  action: {
                    card: {
                      target: {
                        hasAttachment: 'self',
                      },
                      action: {
                        modify: {
                          increment: {
                            defense: 1,
                          },
                        },
                        until: 'end_of_phase',
                      },
                    },
                  },
                },
                {
                  title: '+1 [willpower]',
                  action: {
                    card: {
                      target: {
                        hasAttachment: 'self',
                      },
                      action: {
                        modify: {
                          increment: {
                            willpower: 1,
                          },
                        },
                        until: 'end_of_phase',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  }
);
