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
    action: {
      sequence: [
        {
          card: {
            target: 'self',
            action: {
              modify: {
                description: '+5 [attack] until end of phase',
                bonus: {
                  property: 'attack',
                  amount: 5,
                },
                until: 'end_of_phase',
              },
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
    },
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
