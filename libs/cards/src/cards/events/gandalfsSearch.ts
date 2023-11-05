import { event } from '@card-engine-nx/state';

export const gandalfsSearch = event(
  {
    name: "Gandalf's Search",
    cost: 'X',
    sphere: 'lore',
  },
  {
    description:
      "Action: Look at the top X cards of any player's deck, add 1 of those cards to its owner's hand, and return the rest to the top of the deck in any order.",
    action: {
      player: 'controller',
      action: {
        choosePlayerActions: {
          title: 'Choose player',
          target: 'each',
          action: [
            {
              player: {
                target: 'controller',
                action: {
                  chooseX: {
                    min: 1,
                    max: {
                      min: [
                        {
                          player: {
                            target: 'controller',
                            value: { resources: 'lore' },
                          },
                        },
                        {
                          count: {
                            cards: {
                              owner: 'target',
                              zoneType: 'library',
                            },
                          },
                        },
                      ],
                    },
                    action: [
                      {
                        player: 'controller',
                        action: {
                          payResources: {
                            amount: 'X',
                            sphere: 'lore',
                          },
                        },
                      },
                      {
                        card: {
                          top: {
                            amount: 'X',
                            zone: {
                              player: 'target',
                              type: 'library',
                            },
                          },
                        },
                        action: [{ flip: 'front' }, { mark: 'search' }],
                      },
                      {
                        player: 'controller',
                        action: {
                          chooseCardActions: {
                            title: 'Choose card to add to hand',
                            target: {
                              mark: 'search',
                            },
                            action: ['draw', { clear: 'search' }],
                          },
                        },
                      },
                      {
                        repeat: {
                          amount: {
                            minus: ['X', 1],
                          },
                          action: {
                            player: 'controller',
                            action: {
                              chooseCardActions: {
                                title: 'Choose card to add to library next',
                                target: {
                                  mark: 'search',
                                },
                                action: ['moveToTop', { clear: 'search' }],
                              },
                            },
                          },
                        },
                      },
                      { clearMarks: 'search' },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
  }
);
