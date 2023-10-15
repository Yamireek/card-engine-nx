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
    increment: {
      attack: {
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
    target: { type: 'enemy' },
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
    target: { type: 'enemy', zoneType: 'encounterDeck' },
    response: {
      event: 'revealed',
      condition: {
        card: {
          target: 'self',
          value: {
            hasMark: 'questing',
          },
        },
      },
      action: {
        card: {
          target: 'target',
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
                action: [
                  {
                    discard: {
                      amount: 1,
                      target: 'choice',
                    },
                  },
                  {
                    useLimit: {
                      key: 'eowyn_action',
                      limit: {
                        max: 1,
                        type: 'round',
                      },
                    },
                  },
                ],
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
                increment: {
                  willpower: 1,
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
    limit: {
      max: 1,
      type: 'round',
    },
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
                target: 'each',
                action: {
                  draw: 2,
                },
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
    limit: {
      max: 1,
      type: 'round',
    },
    action: {
      payment: {
        cost: { card: { target: 'self', action: { payResources: 1 } } },
        effect: {
          player: {
            target: 'controller',
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
    },
  }
);

export const aragorn = hero({
  name: 'Aragorn',
  threatCost: 12,
  willpower: 2,
  attack: 3,
  defense: 2,
  hitPoints: 5,
  traits: ['dúnedain', 'noble', 'ranger'],
  keywords: {
    sentinel: true,
  },
  sphere: 'leadership',
});
// TODO Response: After Aragorn commits to a quest, spend 1 resource from his resource pool to ready him.

export const theodred = hero(
  {
    name: 'Théodred',
    threatCost: 8,
    willpower: 1,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['noble', 'rohan', 'warrior'],
    keywords: {},
    sphere: 'leadership',
  },
  {
    description:
      "Response: Response: After Théodred commits to a quest, choose a hero committed to that quest. Add 1 resource to that hero's resource pool.",
    response: {
      event: 'commits',
      action: {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose hero for 1 resource',
            target: {
              type: 'hero',
              mark: 'questing',
            },
            action: {
              generateResources: 1,
            },
          },
        },
      },
    },
  }
);

export const eleanor = hero(
  {
    name: 'Eleanor',
    threatCost: 7,
    willpower: 1,
    attack: 1,
    defense: 2,
    hitPoints: 3,
    traits: ['gondor', 'noble'],
    sphere: 'spirit',
  },
  {
    description:
      'Response: Exhaust Eleanor to cancel the "when revealed" effects of a treachery card just revealed by the encounter deck. Then, discard that card, and replace it with the next card from the encounter deck.',
    target: { type: 'treachery', zoneType: 'encounterDeck' },
    response: {
      event: 'whenRevealed',
      action: [
        {
          card: {
            target: 'self',
            action: 'exhaust',
          },
        },
        { cancel: 'when.revealed' },
        {
          card: {
            target: 'target',
            action: 'discard',
          },
        },
        'revealEncounterCard',
      ],
    },
  }
);

export const dunhere = hero(
  {
    name: 'Dúnhere',
    threatCost: 8,
    willpower: 1,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['rohan', 'warrior'],
    sphere: 'spirit',
  },
  {
    description:
      'Dúnhere can target enemies in the staging area when he attacks alone. When doing so, he gets +1 Attack.',
    card: [
      {
        description: '',
        rule: {
          attacksStagingArea: true,
        },
      },
      {
        description: '',
        if: {
          condition: {
            and: [
              {
                hasMark: 'attacking',
              },
              {
                global: {
                  someCard: {
                    mark: 'defending',
                    zoneType: 'stagingArea',
                  },
                },
              },
            ],
          },
          modifier: {
            description: '',
            increment: {
              attack: 1,
            },
          },
        },
      },
    ],
  }
);

export const denethor = hero({
  name: 'Denethor',
  threatCost: 8,
  willpower: 1,
  attack: 1,
  defense: 3,
  hitPoints: 3,
  traits: ['gondor', 'noble', 'steward'],
  sphere: 'lore',
});
// TODO Action: Exhaust Denethor to look at the top card of the encounter deck. You may move that card to the bottom of the deck.
