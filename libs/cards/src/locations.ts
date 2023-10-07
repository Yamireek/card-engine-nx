import { location } from '@card-engine-nx/state';

export const greatForestWeb = location(
  {
    name: 'Great Forest Web',
    threat: 2,
    questPoints: 2,
    traits: ['forest'],
  },
  {
    description:
      'Travel: Each player must exhaust 1 hero he controls to travel here.',
    travel: {
      player: {
        target: 'each',
        action: {
          useVar: {
            name: 'choosen',
            action: {
              chooseCardActions: {
                title: 'Choose hero to exhaust',
                target: {
                  and: [
                    { type: 'hero' },
                    {
                      controller: {
                        var: 'choosen',
                      },
                    },
                  ],
                },
                action: 'exhaust',
                multi: false,
                optional: false,
              },
            },
          },
        },
      },
    },
  }
);

export const oldForestRoad = location(
  {
    name: 'Old Forest Road',
    threat: 1,
    questPoints: 3,
    traits: ['forest'],
  },
  {
    description:
      'Response: After you travel to Old Forest Road the first player may choose and ready 1 character he controls.',
    target: 'source',
    response: {
      event: 'traveled',
      action: {
        player: {
          target: 'first',
          action: {
            chooseCardActions: {
              title: 'Ready 1 character',
              target: 'character',
              action: 'ready',
              multi: false,
              optional: false,
            },
          },
        },
      },
    },
  }
);

export const forestGate = location(
  {
    name: 'Forest Gate',
    threat: 2,
    questPoints: 4,
    traits: ['forest'],
  },
  {
    description:
      'Response: After you travel to Forest Gate the first player may draw 2 cards.',
    response: {
      event: 'traveled',
      condition: {
        card: {
          target: 'event',
          value: {
            is: 'self',
          },
        },
      },
      action: {
        player: {
          target: 'first',
          action: {
            draw: 2,
          },
        },
      },
    },
  }
);

export const mountainsOfMirkwood = location(
  {
    name: 'Mountains of Mirkwood',
    threat: 2,
    questPoints: 3,
    traits: ['forest', 'mountain'],
  },
  {
    description:
      'Travel: Reveal the top card of the encounter deck and add it to the staging area to travel here.',
    travel: {
      card: {
        target: {
          top: {
            game: 'encounterDeck',
          },
        },
        action: 'reveal',
      },
    },
  },
  {
    description:
      "Response: After Mountains of Mirkwood leaves play as an explored location, each player may search the top 5 cards of his deck for 1 card and add it to his hand. Shuffle the rest of the searched cards back into their owners' decks.",
    target: 'source',
    response: {
      event: 'explored',
      action: {
        player: {
          target: 'each',
          action: [
            {
              useVar: {
                name: 'choosing',
                action: [
                  {
                    deck: { flip: 'front' },
                  },
                  {
                    chooseCardActions: {
                      title: 'Choose card to draw',
                      target: {
                        top: {
                          amount: 5,
                          zone: {
                            player: {
                              id: { var: 'choosing' },
                              zone: 'library',
                            },
                          },
                        },
                      },
                      action: 'draw',
                      multi: false,
                      optional: false,
                    },
                  },
                  {
                    deck: { flip: 'back' },
                  },
                ],
              },
            },
            'shuffleLibrary',
          ],
        },
      },
    },
  }
);

export const necromancersPass = location(
  {
    name: "Necromancer's Pass",
    threat: 3,
    questPoints: 2,
    traits: ['stronghold', 'dolGuldur'],
  },
  {
    description:
      'Travel: The first player must discard 2 cards from his hand at random to travel here.',
    travel: {
      player: {
        target: 'first',
        action: {
          discard: {
            amount: 2,
            target: 'random',
          },
        },
      },
    },
  }
);

export const enchantedStream = location(
  {
    name: 'Enchanted Stream',
    threat: 2,
    questPoints: 2,
    traits: ['forest'],
  },
  {
    description:
      'While Enchanted Stream is the active location, players cannot draw cards.',
    condition: {
      card: {
        target: 'source',
        value: {
          zone: 'activeLocation',
        },
      },
    },
    target: 'each',
    player: 'disable_draw',
  }
);
