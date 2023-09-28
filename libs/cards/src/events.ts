import { event } from '@card-engine-nx/state';

export const loreOfImladris = event(
  {
    name: 'Lore of Imladris',
    cost: 2,
    sphere: 'lore',
  },
  {
    description:
      'Action: Choose a character. Heal all damage from that character.',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose character to heal',
            multi: false,
            optional: false,
            target: 'character',
            action: {
              heal: 'all',
            },
          },
        },
      },
    },
  }
);

export const bladeMastery = event(
  {
    name: 'Blade Mastery',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Choose a character. Until the end of the phase, that character gains +1 Attack and +1 Defense.',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            action: {
              modify: [
                {
                  description: "Can't attack until end of phase",
                  bonus: { property: 'attack', amount: 1 },
                  until: 'end_of_phase',
                },
                {
                  description: "Can't attack until end of phase",
                  bonus: { property: 'defense', amount: 1 },
                  until: 'end_of_phase',
                },
              ],
            },
            multi: false,
            optional: false,
            target: 'character',
            title: 'Choose character for +1 Attack and +1 Defense.',
          },
        },
      },
    },
  }
);

export const feint = event(
  {
    name: 'Feint',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Combat Action: Choose an enemy engaged with a player. That enemy cannot attack that player this phase.',
    phase: 'combat',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            action: {
              modify: {
                description: "Can't attack until end of phase",
                disable: 'attacking',
                until: 'end_of_phase',
              },
            },
            multi: false,
            optional: false,
            title: 'Choose enemy',
            target: {
              and: [{ type: 'enemy' }, { zoneType: 'engaged' }],
            },
          },
        },
      },
    },
  }
);

export const quickStrike = event(
  {
    name: 'Quick Strike',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Exhaust a character you control to immediately declare it as an attacker (and resolve its attack) against any eligible enemy target.',
    action: {
      sequence: [
        {
          player: {
            target: 'controller',
            action: {
              chooseCardActions: {
                title: 'Choose character as attacker',
                multi: false,
                optional: false,
                target: {
                  and: [{ controller: 'controller' }, 'character'],
                },
                action: {
                  sequence: [
                    'exhaust',
                    {
                      setAsVar: 'attacker',
                    },
                  ],
                },
              },
            },
          },
        },
        {
          player: {
            target: 'controller',
            action: {
              chooseCardActions: {
                title: 'Choose enemy to attack',
                multi: false,
                optional: false,
                target: {
                  type: 'enemy',
                },
                action: {
                  setAsVar: 'defender',
                },
              },
            },
          },
        },
        {
          resolveAttack: {
            attackers: {
              var: 'attacker',
            },
            defender: { var: 'defender' },
          },
        },
        {
          setCardVar: {
            name: 'attacker',
            value: undefined,
          },
        },
        {
          setCardVar: {
            name: 'defender',
            value: undefined,
          },
        },
      ],
    },
  }
);

export const rainOfArrows = event(
  {
    name: 'Rain of Arrows',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Exhaust a character you control with the ranged keyword to choose a player. Deal 1 damage to each enemy engaged with that player.',
    action: {
      payment: {
        cost: {
          card: {
            target: {
              and: [
                {
                  controller: 'controller',
                },
                { keyword: 'ranged' },
              ],
            },
            action: 'exhaust',
          },
        },
        effect: {
          player: {
            target: 'controller',
            action: {
              choosePlayerActions: {
                title: 'Choose player',
                multi: false,
                optional: false,
                target: 'each',
                action: {
                  engaged: { dealDamage: 1 },
                },
              },
            },
          },
        },
      },
    },
  }
);

export const standTogether = event(
  {
    name: 'Stand Together',
    cost: 0,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Choose a player. That player may declare any number of his eligible characters as defenders against each enemy attacking him this phase.',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            multi: false,
            target: 'each',
            optional: false,
            action: {
              modify: 'can_declate_multiple_defenders',
              until: 'end_of_phase',
            },
          },
        },
      },
    },
  }
);

export const swiftStrike = event(
  {
    name: 'Swift Strike',
    cost: 2,
    sphere: 'tactics',
  }
  // TODO ability
  // response({
  //   description: "Response: After a character is declared as a defender, deal 2 damage to the attacking enemy.",
  //   event: declaredAsDefender,
  //   condition: (e, view) => isCharacter(e.defender).eval(view),
  //   action: (e) => dealDamage(2)(e.attacker),
  // })
);

export const thicketOfSpears = event(
  {
    name: 'Thicket of Spears',
    cost: 3,
    sphere: 'tactics',
  },
  {
    description:
      "You must use resources from 3 different heroes' pools to pay for this card. Action: Choose a player. That player's engaged enemies cannot attack that player this phase.",
    payment: {
      heroes: 3,
    },
    phase: 'combat',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            optional: false,
            multi: false,
            target: 'each',
            action: {
              engaged: {
                modify: {
                  description: "Can't attack until end of phase",
                  disable: 'attacking',
                  until: 'end_of_phase',
                },
              },
            },
          },
        },
      },
    },
  }
);
