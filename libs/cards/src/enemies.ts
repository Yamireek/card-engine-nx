import { enemy } from '@card-engine-nx/state';

export const kingSpider = enemy(
  {
    name: 'King Spider',
    engagement: 20,
    threat: 2,
    attack: 3,
    defense: 1,
    hitPoints: 3,
    traits: ['creature', 'spider'],
    // TODO Shadow: Defending player must choose and exhaust 1 character he controls. (2 characters instead if this attack is undefended.)
  },
  {
    description:
      'When Revealed: Each player must choose and exhaust 1 character he controls.',
    whenRevealed: {
      player: {
        target: 'each',
        action: {
          useVar: {
            name: 'choosen',
            action: {
              chooseCardActions: {
                target: {
                  and: [
                    {
                      controller: {
                        var: 'choosen',
                      },
                    },
                    'character',
                  ],
                },
                action: 'exhaust',
                multi: false,
                optional: false,
                title: 'Choose character to exhaust',
              },
            },
          },
        },
      },
    },
  }
);

export const forestSpider = enemy(
  {
    name: 'Forest Spider',
    engagement: 25,
    threat: 2,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['creature', 'spider'],
    // TODO Shadow: Defending player must choose and discard 1 attachment he controls.
  },
  {
    description:
      'Forced: After Forest Spider engages a player, it gets +1 Attack until the end of the round.',
    forced: {
      event: 'engaged',
      condition: {
        card: {
          target: 'event',
          value: {
            is: 'self',
          },
        },
      },
      action: {
        card: {
          target: 'self',
          action: {
            modify: {
              description: '+1 [attack] until end of round',
              bonus: {
                amount: 1,
                property: 'attack',
              },
            },
            until: 'end_of_round',
          },
        },
      },
    },
  }
);

export const ungoliantsSpawn = enemy(
  {
    name: "Ungoliant's Spawn",
    engagement: 32,
    threat: 3,
    attack: 5,
    defense: 2,
    hitPoints: 9,
    traits: ['creature', 'spider'],
    // TODO Shadow: Raise defending player's threat by 4. (Raise defending player's threat by 8 instead if this attack is undefended.)
  },
  {
    description:
      'When Revealed: Each character currently committed to a quest gets -1 Willpower until the end of the phase.',
    whenRevealed: {
      card: {
        target: {
          mark: 'questing',
        },
        action: {
          modify: {
            description: '-1 [willpower] until end of phase',
            bonus: {
              property: 'willpower',
              amount: -1,
            },
          },
          until: 'end_of_phase',
        },
      },
    },
  }
);

export const dolGuldurOrcs = enemy(
  {
    name: 'Dol Guldur Orcs',
    engagement: 10,
    threat: 2,
    attack: 2,
    defense: 0,
    hitPoints: 3,
    traits: ['dolGuldur', 'orc'],
    // TODO Shadow: Attacking enemy gets +1 Attack (+3 Attack instead if this attack is undefended.)
  },
  {
    description:
      'When Revealed: The first player chooses 1 character currently committed to a quest. Deal 2 damage to that character.',
    whenRevealed: {
      player: {
        target: 'first',
        action: {
          chooseCardActions: {
            target: { mark: 'questing' },
            action: {
              dealDamage: 2,
            },
            multi: false,
            optional: false,
            title: 'Choose character for 2 damage',
          },
        },
      },
    },
  }
);

export const chieftanUfthak = enemy(
  {
    name: 'Chieftan Ufthak',
    engagement: 35,
    threat: 2,
    attack: 3,
    defense: 3,
    hitPoints: 6,
    victory: 4,
    traits: ['dolGuldur', 'orc'],
  },
  {
    description:
      'Chieftain Ufthak get +2 Attack for each resource token on him.',
    bonus: {
      property: 'attack',
      amount: {
        multiply: [
          2,
          {
            card: {
              target: 'self',
              value: {
                tokens: 'resources',
              },
            },
          },
        ],
      },
    },
  },
  {
    description:
      'Forced: After Chieftain Ufthak attacks, place 1 resource token on him.',
    forced: {
      event: 'attacked',
      condition: {
        card: {
          target: 'event',
          value: {
            is: 'self',
          },
        },
      },
      action: {
        card: {
          target: 'event',
          action: {
            generateResources: 1,
          },
        },
      },
    },
  }
);

export const dolGuldurBeastmaster = enemy({
  name: 'Dol Guldur Beastmaster',
  engagement: 35,
  threat: 2,
  attack: 3,
  defense: 1,
  hitPoints: 5,
  traits: ['dolGuldur', 'orc'],
  // TODO Forced: When Dol Guldur Beastmaster attacks, deal it 1 additional shadow card.
});

export const eastBightPatrol = enemy({
  name: 'East Bight Patrol',
  engagement: 5,
  threat: 3,
  attack: 3,
  defense: 1,
  hitPoints: 2,
  traits: ['goblin', 'orc'],
  // TODO Shadow: attacking enemy gets +1 Attack (If this attack is undefended, also raise your threat by 3.)
});

export const blackForestBats = enemy(
  {
    name: 'Black Forest Bats',
    engagement: 15,
    threat: 1,
    attack: 1,
    defense: 0,
    hitPoints: 2,
    traits: ['creature'],
  },
  {
    description:
      'When Revealed: Each player must choose 1 character currently committed to a quest, and remove that character from the quest. (The chosen character does not ready.)',
    whenRevealed: {
      player: {
        target: 'each',
        action: {
          chooseCardActions: {
            title: 'Choose character to remove from quest',
            target: {
              mark: 'questing',
            },
            action: {
              clear: 'questing',
            },
            multi: false,
            optional: false,
          },
        },
      },
    },
  }
);

export const hummerhorns = enemy(
  {
    name: 'Hummerhorns',
    engagement: 40,
    threat: 1,
    attack: 2,
    defense: 0,
    hitPoints: 3,
    victory: 5,
    traits: ['creature', 'insect'],
    // TODO Shadow: Deal 1 damage to each character the defending player controls. (2 damage instead if this attack is undefended.)
  },
  {
    description:
      'Forced: After Hummerhorns engages you, deal 5 damage to a single hero you control.',
    forced: {
      event: 'engaged',
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
          target: 'event',
          action: {
            chooseCardActions: {
              title: 'Choose hero to deal 5 damage',
              target: {
                and: [{ type: 'hero' }, { controller: 'event' }],
              },
              action: {
                dealDamage: 5,
              },
              multi: false,
              optional: false,
            },
          },
        },
      },
    },
  }
);
