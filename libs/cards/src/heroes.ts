import { hero } from '@card-engine-nx/state';

export const gimli = hero(
  {
    name: 'Gimli',
    threatCost: 11,
    willpower: 2,
    attack: 2,
    defense: 2,
    hitPoints: 5,
    traits: ['dwarf', 'noble', 'warrior'],
    sphere: 'tactics',
  },
  {
    description: 'Gimli gets +1 [attack] for each damage token on him.',
    bonus: {
      property: 'attack',
      amount: {
        card: {
          target: 'self',
          value: {
            tokens: 'damage',
          },
        },
      },
    },
  }
);

export const legolas = hero(
  {
    name: 'Legolas',
    threatCost: 9,
    willpower: 1,
    attack: 3,
    defense: 1,
    hitPoints: 4,
    traits: ['noble', 'silvan', 'warrior'],
    sphere: 'tactics',
    keywords: {
      ranged: true,
    },
  },
  {
    description:
      'After Legolas participates in an attack that destroys an enemy, place 2 progress tokens on the current quest.',
    response: {
      event: 'destroyed',
      condition: {
        event: {
          type: 'destroyed',
          isAttacker: 'self',
        },
      },
      action: {
        placeProgress: 2,
      },
    },
  }
);

export const thalin = hero(
  {
    name: 'Thalin',
    threatCost: 9,
    willpower: 1,
    attack: 2,
    defense: 2,
    hitPoints: 4,
    traits: ['dwarf', 'warrior'],
    sphere: 'tactics',
  },
  {
    description:
      'While Thalin is committed to a quest, deal 1 damage to each enemy as it is revealed by the encounter deck.',
    response: {
      event: 'revealed',
      condition: {
        and: [
          {
            card: {
              target: 'self',
              value: {
                hasMark: 'questing',
              },
            },
          },
          {
            card: {
              target: 'event',
              value: {
                isType: 'enemy',
              },
            },
          },
        ],
      },
      action: {
        card: {
          target: 'event',
          action: {
            dealDamage: 1,
          },
        },
      },
    },
  }
);

export const gloin = hero(
  {
    name: 'Glóin',
    threatCost: 9,
    willpower: 2,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['dwarf', 'noble'],
    sphere: 'leadership',
  },
  {
    description:
      'After Glóin suffers damage, add 1 resource to his resource pool for each point of damage he just suffered.',
    response: {
      event: 'receivedDamage',
      action: {
        card: {
          target: 'self',
          action: {
            generateResources: {
              event: { type: 'receivedDamage', value: 'damage' },
            },
          },
        },
      },
    },
  }
);

export const eowyn = hero(
  {
    name: 'Éowyn',
    threatCost: 9,
    willpower: 4,
    attack: 1,
    defense: 1,
    hitPoints: 3,
    traits: ['noble', 'rohan'],
    sphere: 'spirit',
  },
  {
    description:
      'Discard 1 card from your hand to give Éowyn +1 [willpower] until the end of the phase. This effect may be triggered by each player once each round.',
    action: {
      payment: {
        cost: {
          player: {
            target: 'controller',
            action: {
              choosePlayerActions: {
                target: 'each',
                title: 'Choose player to discard card',
                action: {
                  sequence: [
                    {
                      discard: {
                        amount: 1,
                        target: 'choice',
                      },
                    },
                    {
                      setLimit: {
                        key: 'eowyn_action',
                        limit: 'once_per_round',
                      },
                    },
                  ],
                },
                multi: false,
                optional: false,
              },
            },
          },
        },
        effect: {
          card: {
            target: 'self',
            action: {
              modify: {
                description: '+1 [willpower] until the end of the phase',
                bonus: {
                  property: 'willpower',
                  amount: 1,
                },
              },
              until: 'end_of_phase',
            },
          },
        },
      },
    },
  }
);

export const beravor = hero(
  {
    name: 'Beravor',
    threatCost: 10,
    willpower: 2,
    attack: 2,
    defense: 2,
    hitPoints: 4,
    traits: ['dúnedain', 'ranger'],
    sphere: 'lore',
  },
  {
    description:
      'Exhaust Beravor to choose a player. That player draws 2 cards. Limit once per round.',
    limit: 'once_per_round',
    action: {
      payment: {
        cost: {
          card: {
            target: 'self',
            action: 'exhaust',
          },
        },
        effect: {
          player: {
            target: 'controller',
            action: {
              choosePlayerActions: {
                title: 'Choose player to draw 2 cards',
                action: {
                  draw: 2,
                },
                optional: false,
                target: 'each',
                multi: false,
              },
            },
          },
        },
      },
    },
  }
);

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
    limit: 'once_per_round',
    action: {
      payment: {
        cost: { card: { target: 'self', action: { payResources: 1 } } },
        effect: {
          player: {
            target: 'controller',
            action: {
              chooseCardActions: {
                title: 'Choose character to heal',
                multi: false,
                optional: false,
                action: { heal: 1 },
                target: 'character',
              },
            },
          },
        },
      },
    },
  }
);
