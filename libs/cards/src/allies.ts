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
    response: {
      event: 'declaredAsDefender',
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
    limit: 'once_per_round',
    action: [
      {
        card: {
          target: 'self',
          action: {
            modify: {
              description: '+5 [attack] until end of phase',
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
              and: ['inAPlay', { name: 'Beorn' }],
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
    response: {
      event: 'enteredPlay',
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
          target: 'controller',
          action: {
            chooseActions: {
              title: 'Choose one',
              multi: false,
              optional: false,
              actions: [
                {
                  title: 'Draw 3 cards',
                  action: {
                    player: {
                      target: 'controller',
                      action: {
                        draw: 3,
                      },
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
                          multi: false,
                          optional: false,
                        },
                      },
                    },
                  },
                },
                {
                  title: 'Reduce your threat by 5',
                  action: {
                    player: {
                      target: 'controller',
                      action: {
                        incrementThreat: -5,
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
                    description: '+1 [willpower] until the end of the phase',
                    increment: { willpower: 1 },
                  },
                  until: 'end_of_phase',
                },
              },
              title: 'Choose player',
              optional: false,
              multi: false,
            },
          },
        },
      },
    ],
  }
);

export const sonOfArnor = ally({
  name: 'Son of Arnor',
  cost: 3,
  willpower: 0,
  attack: 2,
  defense: 0,
  hitPoints: 2,
  traits: ['dúnedain'],
  sphere: 'leadership',
  unique: false,
});
// TODO Response: After Son of Arnor enters play, choose an enemy card in the staging area or currently engaged with another player. Engage that enemy.

export const snowbournScout = ally({
  name: 'Snowbourn Scout',
  cost: 1,
  willpower: 0,
  attack: 0,
  defense: 1,
  hitPoints: 1,
  traits: ['rohan', 'scout'],
  sphere: 'leadership',
  unique: false,
});
// TODO Response: After Snowbourn Scout enters play, choose a location. Place 1 progress token on that location.

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

export const longbeardOrcSlayer = ally({
  name: 'Longbeard Orc Slayer',
  cost: 4,
  willpower: 0,
  attack: 2,
  defense: 1,
  hitPoints: 3,
  traits: ['dwarf', 'warrior'],
  sphere: 'leadership',
  unique: false,
});
// TODO Response: After Longbeard Orc Slayer enters play, deal 1 damage to each Orc enemy in play.

export const brokIronfist = ally({
  name: 'Brok Ironfist',
  cost: 6,
  willpower: 2,
  attack: 2,
  defense: 1,
  hitPoints: 4,
  traits: ['dwarf', 'warrior'],
  sphere: 'leadership',
  unique: true,
});
// TODO Response:After a Dwarf hero you control leaves play, put Brok Ironfist into play from your hand.

export const wanderingTook = ally({
  name: 'Wandering Took',
  cost: 2,
  willpower: 1,
  attack: 1,
  defense: 1,
  hitPoints: 2,
  traits: ['hobbit'],
  sphere: 'spirit',
  unique: false,
});
// TODO Action: Reduce your threat by 3 to give control of Wandering Took to another player. Raise that player's threat by 3. (Limit once per round.)

export const lorienGuide = ally({
  name: 'Lórien Guide',
  cost: 3,
  willpower: 1,
  attack: 1,
  defense: 0,
  hitPoints: 2,
  traits: ['silvan', 'scout'],
  sphere: 'spirit',
  unique: false,
});
// TODO Response: After Lórien Guide commits to a quest, place 1 progress token on the active location.

export const northernTracker = ally({
  name: 'Northern Tracker',
  cost: 4,
  willpower: 1,
  attack: 2,
  defense: 2,
  hitPoints: 3,
  traits: ['dúnedain', 'ranger'],
  sphere: 'spirit',
  unique: false,
});
// TODO Response: After Northern Tracker commits to a quest, place 1 progress token on each location in the staging area.

export const daughterOfTheNimrodel = ally({
  name: 'Daughter of the Nimrodel',
  cost: 3,
  willpower: 1,
  attack: 0,
  defense: 0,
  hitPoints: 1,
  traits: ['silvan'],
  sphere: 'lore',
  unique: false,
});
// TODO Action: Exhaust Daughter of the Nimrodel to heal up to 2 damage on any 1 hero.

export const ereborHammersmith = ally({
  name: 'Erebor Hammersmith',
  cost: 2,
  willpower: 1,
  attack: 1,
  defense: 1,
  hitPoints: 3,
  traits: ['dwarf', 'craftsman'],
  sphere: 'lore',
  unique: false,
});
// TODO Response: After you play Erebor Hammersmith, return the topmost attachment in any player's discard pile to his hand.

export const henamarthRiversong = ally({
  name: 'Henamarth Riversong',
  cost: 1,
  willpower: 1,
  attack: 1,
  defense: 0,
  hitPoints: 1,
  traits: ['silvan'],
  sphere: 'lore',
  unique: true,
});
// TODO Action: Exhaust Henamarth Riversong to look at the top card of the encounter deck.

export const minerOfTheIronHills = ally({
  name: 'Miner of the Iron Hills',
  cost: 2,
  willpower: 0,
  attack: 1,
  defense: 1,
  hitPoints: 2,
  traits: ['dwarf'],
  sphere: 'lore',
  unique: false,
});
// TODO Response: After Miner of the Iron Hills enters play, choose and discard 1 Condition attachment from play.

export const gleowine = ally({
  name: 'Gléowine',
  cost: 2,
  willpower: 1,
  attack: 0,
  defense: 0,
  hitPoints: 2,
  traits: ['minstrel', 'rohan'],
  sphere: 'lore',
  unique: true,
});
// TODO Action: Exhaust Gléowine to choose a player. That player draws 1 card.
