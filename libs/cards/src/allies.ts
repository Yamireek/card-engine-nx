import { ally } from '@card-engine-nx/state';

export const veteranAxehand = ally({
  name: 'Veteran Axehand',
  cost: 2,
  willpower: 0,
  attack: 2,
  defense: 1,
  hitPoints: 2,
  traits: ['dwarf', 'warrior'],
  sphere: 'tactics',
  unique: false,
});

export const gondorianSpearman = ally(
  {
    name: 'Gondorian Spearman',
    unique: false,
    cost: 2,
    willpower: 0,
    attack: 1,
    defense: 1,
    hitPoints: 1,
    traits: ['gondor', 'warrior'],
    sphere: 'tactics',
    keywords: {
      sentinel: true,
    },
  },
  {
    description:
      'Response: After Gondorian Spearman is declared as a defender, deal 1 damage to the attacking enemy.',
    target: 'self',
    response: {
      event: 'declaredAsDefender',
      action: {
        card: {
          target: {
            event: 'attacking',
          },
          action: {
            dealDamage: 1,
          },
        },
      },
    },
  }
);

export const beorn = ally(
  {
    name: 'Beorn',
    unique: true,
    cost: 6,
    willpower: 1,
    attack: 3,
    defense: 3,
    hitPoints: 6,
    traits: ['beorning', 'warrior'],
    sphere: 'tactics',
  },
  {
    description:
      'Action: Beorn gains +5 Attack until the end of the phase. At the end of the phase in which you trigger this effect, shuffle Beorn back into your deck. (Limit once per round.)',
    limit: { max: 1, type: 'round' },
    action: [
      {
        card: {
          target: 'self',
          action: {
            modify: {
              increment: {
                attack: 5,
              },
            },
            until: 'end_of_phase',
          },
        },
      },
      {
        atEndOfPhase: {
          card: {
            target: {
              name: 'Beorn',
              simple: 'inAPlay',
            },
            action: 'shuffleToDeck',
          },
        },
      },
    ],
  }
);

export const horsebackArcher = ally({
  name: 'Horseback Archer',
  unique: false,
  cost: 3,
  willpower: 0,
  attack: 2,
  defense: 1,
  hitPoints: 2,
  traits: ['rohan', 'archer'],
  sphere: 'tactics',
  keywords: {
    ranged: true,
  },
});

export const gandalf = ally(
  {
    name: 'Gandalf',
    unique: true,
    cost: 5,
    willpower: 4,
    attack: 4,
    defense: 4,
    hitPoints: 5,
    traits: ['istari'],
    sphere: 'neutral',
  },
  {
    description: 'At the end of the round, discard Gandalf from play.',
    forced: {
      event: 'end_of_round',
      condition: {
        card: {
          target: 'self',
          value: 'in_a_play',
        },
      },
      action: {
        card: {
          target: 'self',
          action: 'discard',
        },
      },
    },
  },
  {
    description:
      'Response: After Gandalf enters play, (choose 1): draw 3 cards, deal 4 damage to 1 enemy in play, or reduce your threat by 5.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: 'controller',
        action: {
          chooseActions: {
            title: 'Choose one',
            actions: [
              {
                title: 'Draw 3 cards',
                action: {
                  player: 'controller',
                  action: {
                    draw: 3,
                  },
                },
              },
              {
                title: 'Deal 4 damage to 1 enemy in play',
                action: {
                  player: {
                    target: 'controller',
                    action: {
                      chooseCardActions: {
                        title: 'Choose enemy',
                        target: {
                          type: 'enemy',
                        },
                        action: {
                          dealDamage: 4,
                        },
                      },
                    },
                  },
                },
              },
              {
                title: 'Reduce your threat by 5',
                action: {
                  player: 'controller',
                  action: {
                    incrementThreat: -5,
                  },
                },
              },
            ],
          },
        },
      },
    },
  }
);

export const guardOfTheCitadel = ally({
  name: 'Guard of the Citadel',
  cost: 2,
  willpower: 1,
  attack: 1,
  defense: 0,
  hitPoints: 2,
  traits: ['gondor', 'warrior'],
  sphere: 'leadership',
  unique: false,
});

export const faramir = ally(
  {
    name: 'Faramir',
    cost: 4,
    willpower: 2,
    attack: 1,
    defense: 2,
    hitPoints: 3,
    traits: ['gondor', 'noble', 'ranger'],
    sphere: 'leadership',
    unique: true,
  },
  {
    description:
      'Action: Exhaust Faramir to choose a player. Each character controlled by that player gets +1 [willpower] until the end of the phase.',
    action: [
      {
        card: {
          target: 'self',
          action: 'exhaust',
        },
      },
      {
        player: {
          target: 'controller',
          action: {
            choosePlayerActions: {
              target: 'each',
              action: {
                controlled: {
                  modify: {
                    increment: { willpower: 1 },
                  },
                  until: 'end_of_phase',
                },
              },
              title: 'Choose player',
            },
          },
        },
      },
    ],
  }
);

export const sonOfArnor = ally(
  {
    name: 'Son of Arnor',
    cost: 3,
    willpower: 0,
    attack: 2,
    defense: 0,
    hitPoints: 2,
    traits: ['dúnedain'],
    sphere: 'leadership',
    unique: false,
  },
  {
    description:
      'Response: After Son of Arnor enters play, choose an enemy card in the staging area or currently engaged with another player. Engage that enemy.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose enemy to engage',
              target: { type: 'enemy' },
              action: { engagePlayer: 'controller' },
            },
          },
        },
      },
    },
  }
);

export const snowbournScout = ally(
  {
    name: 'Snowbourn Scout',
    cost: 1,
    willpower: 0,
    attack: 0,
    defense: 1,
    hitPoints: 1,
    traits: ['rohan', 'scout'],
    sphere: 'leadership',
    unique: false,
  },
  {
    description:
      'Response: After Snowbourn Scout enters play, choose a location. Place 1 progress token on that location.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose location',
              target: { type: 'location' },
              action: { placeProgress: 1 },
            },
          },
        },
      },
    },
  }
);

export const silverlodeArcher = ally({
  name: 'Silverlode Archer',
  cost: 3,
  willpower: 1,
  attack: 2,
  defense: 0,
  hitPoints: 1,
  traits: ['archer', 'silvan'],
  sphere: 'leadership',
  unique: false,
  keywords: {
    ranged: true,
  },
});

export const longbeardOrcSlayer = ally(
  {
    name: 'Longbeard Orc Slayer',
    cost: 4,
    willpower: 0,
    attack: 2,
    defense: 1,
    hitPoints: 3,
    traits: ['dwarf', 'warrior'],
    sphere: 'leadership',
    unique: false,
  },
  {
    description:
      'Response: After Longbeard Orc Slayer enters play, deal 1 damage to each Orc enemy in play.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        card: {
          target: {
            and: [{ type: 'enemy' }, { trait: 'orc' }],
          },
          action: {
            dealDamage: 1,
          },
        },
      },
    },
  }
);

export const brokIronfist = ally(
  {
    name: 'Brok Ironfist',
    cost: 6,
    willpower: 2,
    attack: 2,
    defense: 1,
    hitPoints: 4,
    traits: ['dwarf', 'warrior'],
    sphere: 'leadership',
    unique: true,
  },
  {
    description:
      'Response: After a Dwarf hero you control leaves play, put Brok Ironfist into play from your hand.',
    zone: 'hand',
    target: {
      and: [{ type: 'hero' }, { trait: 'dwarf' }, { controller: 'controller' }],
    },
    response: {
      event: 'leftPlay',
      action: {
        card: {
          target: 'self',
          action: {
            putInPlay: 'controller',
          },
        },
      },
    },
  }
);

export const wanderingTook = ally(
  {
    name: 'Wandering Took',
    cost: 2,
    willpower: 1,
    attack: 1,
    defense: 1,
    hitPoints: 2,
    traits: ['hobbit'],
    sphere: 'spirit',
    unique: false,
  },
  {
    description:
      "Action: Reduce your threat by 3 to give control of Wandering Took to another player. Raise that player's threat by 3. (Limit once per round.)",
    limit: { type: 'round', max: 1 },
    action: {
      player: 'controller',
      action: [
        { incrementThreat: -3 },
        {
          choosePlayerActions: {
            title: 'Choose player',
            target: { not: 'controller' },
            action: [
              { incrementThreat: 3 },
              {
                card: {
                  target: 'self',
                  action: [
                    {
                      move: {
                        to: {
                          player: 'target',
                          type: 'playerArea',
                        },
                        side: 'front',
                      },
                    },
                    {
                      setController: 'target',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
);

export const lorienGuide = ally(
  {
    name: 'Lórien Guide',
    cost: 3,
    willpower: 1,
    attack: 1,
    defense: 0,
    hitPoints: 2,
    traits: ['silvan', 'scout'],
    sphere: 'spirit',
    unique: false,
  },
  {
    description:
      'Response: After Lórien Guide commits to a quest, place 1 progress token on the active location.',
    target: 'self',
    response: {
      event: 'commits',
      action: {
        card: {
          target: { zoneType: 'activeLocation' },
          action: { placeProgress: 1 },
        },
      },
    },
  }
);

export const northernTracker = ally(
  {
    name: 'Northern Tracker',
    cost: 4,
    willpower: 1,
    attack: 2,
    defense: 2,
    hitPoints: 3,
    traits: ['dúnedain', 'ranger'],
    sphere: 'spirit',
    unique: false,
  },
  {
    description:
      'Response: After Northern Tracker commits to a quest, place 1 progress token on each location in the staging area.',
    target: 'self',
    response: {
      event: 'commits',
      action: {
        card: {
          target: { and: [{ type: 'location' }, { zoneType: 'stagingArea' }] },
          action: { placeProgress: 1 },
        },
      },
    },
  }
);

export const daughterOfTheNimrodel = ally(
  {
    name: 'Daughter of the Nimrodel',
    cost: 3,
    willpower: 1,
    attack: 0,
    defense: 0,
    hitPoints: 1,
    traits: ['silvan'],
    sphere: 'lore',
    unique: false,
  },
  {
    description:
      'Action: Exhaust Daughter of the Nimrodel to heal up to 2 damage on any 1 hero.',
    action: [
      { card: { target: 'self', action: 'exhaust' } },
      {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose hero to heal',
              target: { type: 'hero' },
              action: { heal: 2 },
            },
          },
        },
      },
    ],
  }
);

export const ereborHammersmith = ally(
  {
    name: 'Erebor Hammersmith',
    cost: 2,
    willpower: 1,
    attack: 1,
    defense: 1,
    hitPoints: 3,
    traits: ['dwarf', 'craftsman'],
    sphere: 'lore',
    unique: false,
  },
  {
    description:
      "Response: After you play Erebor Hammersmith, return the topmost attachment in any player's discard pile to his hand.",
    target: 'self',
    response: {
      event: 'played',
      action: {
        player: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              card: {
                target: {
                  top: {
                    amount: 1,
                    filter: { type: 'attachment' },
                    zone: {
                      player: 'target',
                      type: 'discardPile',
                    },
                  },
                },
                action: {
                  move: {
                    side: 'front',
                    to: {
                      player: 'target',
                      type: 'hand',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }
);

export const henamarthRiversong = ally(
  {
    name: 'Henamarth Riversong',
    cost: 1,
    willpower: 1,
    attack: 1,
    defense: 0,
    hitPoints: 1,
    traits: ['silvan'],
    sphere: 'lore',
    unique: true,
  },
  {
    description:
      'Action: Exhaust Henamarth Riversong to look at the top card of the encounter deck.',
    action: [
      {
        card: 'self',
        action: 'exhaust',
      },
      { card: { top: 'encounterDeck' }, action: { flip: 'front' } },
    ],
  }
);

export const minerOfTheIronHills = ally(
  {
    name: 'Miner of the Iron Hills',
    cost: 2,
    willpower: 0,
    attack: 1,
    defense: 1,
    hitPoints: 2,
    traits: ['dwarf'],
    sphere: 'lore',
    unique: false,
  },
  {
    description:
      'Response: After Miner of the Iron Hills enters play, choose and discard 1 Condition attachment from play.',
    target: 'self',
    response: {
      event: 'enteredPlay',
      action: {
        player: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose attachment',
            target: { and: [{ type: 'attachment' }, { trait: 'condition' }] },
            action: 'discard',
          },
        },
      },
    },
  }
);

export const gleowine = ally(
  {
    name: 'Gléowine',
    cost: 2,
    willpower: 1,
    attack: 0,
    defense: 0,
    hitPoints: 2,
    traits: ['minstrel', 'rohan'],
    sphere: 'lore',
    unique: true,
  },
  {
    description:
      'Action: Exhaust Gléowine to choose a player. That player draws 1 card.',
    action: [
      { card: { target: 'self', action: 'exhaust' } },
      {
        player: {
          target: 'controller',
          action: {
            choosePlayerActions: {
              title: 'Choose player to draw 1 card',
              target: 'each',
              action: { draw: 1 },
            },
          },
        },
      },
    ],
  }
);
