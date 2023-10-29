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
      'Action: Choose a character. Until the end of the phase, that character gains +1 [attack] and +1 [defense].',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose character for +1 Attack and +1 Defense.',
            target: 'character',
            action: {
              modify: {
                increment: { attack: 1, defense: 1 },
              },
              until: 'end_of_phase',
            },
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
                disable: 'attacking',
              },
              until: 'end_of_phase',
            },
            title: 'Choose enemy',
            target: { type: 'enemy', zoneType: 'engaged' },
          },
        },
      },
    },
  }
);

// TODO custom action
export const quickStrike = event(
  {
    name: 'Quick Strike',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Exhaust a character you control to immediately declare it as an attacker (and resolve its attack) against any eligible enemy target.',
    action: [
      {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose character as attacker',
              target: {
                simple: 'character',
                controller: 'controller',
              },
              action: [
                'exhaust',
                {
                  setAsVar: 'attacker',
                },
              ],
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
              target: { zoneType: 'engaged' },
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
          player: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose character to exhaust',
              target: {
                controller: 'controller',
                keyword: 'ranged',
              },
              action: 'exhaust',
            },
          },
        },
        effect: {
          player: {
            target: 'controller',
            action: {
              choosePlayerActions: {
                title: 'Choose player',
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
    phase: 'combat',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
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
  },
  {
    description:
      'Response: After a character is declared as a defender, deal 2 damage to the attacking enemy.',
    target: 'character',
    response: {
      event: 'declaredAsDefender',
      action: {
        card: {
          target: {
            event: 'attacking',
          },
          action: {
            dealDamage: 2,
          },
        },
      },
    },
  }
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
    cost: {
      heroes: 3,
    },
    phase: 'combat',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              engaged: {
                modify: {
                  disable: 'attacking',
                },
                until: 'end_of_phase',
              },
            },
          },
        },
      },
    },
  }
);

export const everVigilant = event(
  {
    name: 'Ever Vigilant',
    cost: 1,
    sphere: 'leadership',
  },
  {
    description: 'Action: Choose and ready 1 ally card.',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose ally to ready',
            target: { type: 'ally' },
            action: 'ready',
          },
        },
      },
    },
  }
);

export const commonCause = event(
  {
    name: 'Common Cause',
    cost: 0,
    sphere: 'leadership',
  },
  {
    description:
      'Action: Exhaust 1 hero you control to choose and ready a different hero.',
    action: [
      {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose hero to exhaust',
              target: { type: 'hero', controller: 'controller' },
              action: [
                {
                  setAsVar: 'exhausted',
                },
                'exhaust',
              ],
            },
          },
        },
      },
      {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose hero to ready',
              target: { type: 'hero', not: { var: 'exhausted' } },
              action: 'ready',
            },
          },
        },
      },
    ],
  }
);

export const forGondor = event(
  {
    name: 'For Gondor!',
    cost: 2,
    sphere: 'leadership',
  },
  {
    description:
      'Action: Until the end of the phase, all characters get +1 [attack]. All Gondor characters also get +1 [defense] until the end of the phase.',
    action: [
      {
        card: {
          target: 'character',
          action: {
            modify: {
              increment: {
                attack: 1,
              },
            },
            until: 'end_of_phase',
          },
        },
      },
      {
        card: {
          target: { trait: 'gondor' },
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
    ],
  }
);

export const sneakAttack = event(
  {
    name: 'Sneak Attack',
    cost: 1,
    sphere: 'leadership',
  },
  {
    description:
      'Action: Put 1 ally card into play from your hand. At the end of the phase, if that ally is still in play, return it to your hand.',
    action: [
      {
        player: {
          target: 'controller',
          action: {
            chooseCardActions: {
              title: 'Choose ally to put in play',
              target: { type: 'ally', zoneType: 'hand' },
              action: [
                {
                  putInPlay: 'controller',
                },
                {
                  mark: 'sneak.attack',
                },
              ],
            },
          },
        },
      },
      {
        atEndOfPhase: [
          {
            card: { mark: 'sneak.attack' },
            action: [
              {
                move: {
                  side: 'front',
                  to: {
                    player: { controllerOf: 'target' },
                    type: 'hand',
                  },
                },
              },
            ],
          },
          { clearMarks: 'sneak.attack' },
        ],
      },
    ],
  }
);

export const valiantSacrifice = event(
  {
    name: 'Valiant Sacrifice',
    cost: 1,
    sphere: 'leadership',
  },
  {
    description:
      "Response: After an ally card leaves play, that card's controller draws 2 cards.",
    target: { type: 'ally' },
    response: {
      event: 'leftPlay',
      action: {
        player: {
          target: { controllerOf: 'target' },
          action: {
            draw: 2,
          },
        },
      },
    },
  }
);

export const grimResolve = event(
  {
    name: 'Grim Resolve',
    cost: 5,
    sphere: 'leadership',
  },
  {
    description: 'Action: Ready all character cards in play.',
    action: {
      card: {
        target: 'character',
        action: 'ready',
      },
    },
  }
);

export const theGaladhrimsGreeting = event(
  {
    name: "The Galadhrim's Greeting",
    cost: 3,
    sphere: 'spirit',
  },
  {
    description:
      "Action: Reduce one player's threat by 6, or reduce each player's threat by 2.",
    action: {
      player: {
        target: 'controller',
        action: {
          chooseActions: {
            title: 'Choose one',
            actions: [
              {
                title: "Reduce one player's threat by 6",
                action: {
                  player: {
                    target: 'controller',
                    action: {
                      choosePlayerActions: {
                        title: 'Choose player',
                        target: 'each',
                        action: {
                          incrementThreat: -6,
                        },
                      },
                    },
                  },
                },
              },
              {
                title: "Reduce each player's threat by 2.",
                action: {
                  player: {
                    target: 'each',
                    action: {
                      incrementThreat: -2,
                    },
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

export const strengthOfWill = event(
  {
    name: 'Strength of Will',
    cost: 0,
    sphere: 'spirit',
  },
  {
    description:
      'Response: After you travel to a location, exhaust a [spirit] character to place 2 progress tokens on that location.',
    target: { type: 'location' },
    response: {
      event: 'traveled',
      action: [
        {
          player: {
            target: 'controller',
            action: {
              chooseCardActions: {
                title: 'Choose character',
                target: {
                  simple: 'character',
                  sphere: 'spirit',
                },
                action: 'exhaust',
              },
            },
          },
        },
        {
          card: {
            target: 'target',
            action: {
              placeProgress: 2,
            },
          },
        },
      ],
    },
  }
);

export const hastyStroke = event(
  {
    name: 'Hasty Stroke',
    cost: 1,
    sphere: 'spirit',
  },
  {
    description:
      'Response: Cancel a shadow effect just triggered during combat.',
    response: {
      event: 'shadow',
      action: {
        cancel: 'shadow',
      },
    },
  }
);

export const willOfTheWest = event(
  {
    name: 'Will of the West',
    cost: 1,
    sphere: 'spirit',
  },
  {
    description:
      "Action: Choose a player. Shuffle that player's discard pile back into his deck. Remove Will of the West from the game.",
    action: [
      {
        player: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              card: {
                target: { zoneType: 'discardPile', owner: 'target' },
                action: {
                  move: {
                    side: 'back',
                    to: {
                      player: 'target',
                      type: 'library',
                    },
                  },
                },
              },
            },
          },
        },
      },
      { card: 'self', action: { move: { side: 'front', to: 'removed' } } },
    ],
  }
);

export const aTestOfWill = event(
  {
    name: 'A Test of Will',
    cost: 1,
    sphere: 'spirit',
  },
  {
    description:
      'Response: Cancel the “when revealed” effects of a card that was just revealed from the encounter deck.',
    target: {
      side: 'front',
      zoneType: 'encounterDeck',
    },
    response: {
      event: 'whenRevealed',
      action: {
        cancel: 'when.revealed',
      },
    },
  }
);

export const standAndFight = event(
  {
    name: 'Stand and Fight',
    cost: 'X',
    sphere: 'spirit',
  },
  {
    description:
      "Action: Choose an ally with a printed cost of X in any player's discard pile. Put that ally into play under your control. (The chosen ally can belong to any sphere of influence.)",
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose ally',
          target: {
            type: 'ally',
            sphere: 'any',
            zoneType: 'discardPile',
          },
          action: [
            {
              controller: {
                payResources: {
                  amount: { card: { target: 'target', value: 'cost' } },
                  sphere: 'spirit',
                },
              },
            },
            { putInPlay: 'controller' },
          ],
        },
      },
    },
  }
);

export const aLightInIheDark = event(
  {
    name: 'A Light in the Dark',
    cost: 2,
    sphere: 'spirit',
  },
  {
    description:
      'Action: Choose an enemy engaged with a player. Return that enemy to the staging area.',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose enemy',
            target: { type: 'enemy', zoneType: 'engaged' },
            action: {
              move: {
                side: 'front',
                to: 'stagingArea',
              },
            },
          },
        },
      },
    },
  }
);

export const dwarvenTomb = event(
  {
    name: 'Dwarven Tomb',
    cost: 1,
    sphere: 'spirit',
  },
  {
    description:
      'Action: Return 1 [spirit] card from your discard pile to your hand.',
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose card',
            target: {
              zoneType: 'discardPile',
              owner: 'controller',
              sphere: 'spirit',
            },
            action: {
              move: {
                side: 'front',
                to: {
                  player: 'controller',
                  type: 'hand',
                },
              },
            },
          },
        },
      },
    },
  }
);

export const fortuneOrFate = event(
  {
    name: 'Fortune or Fate',
    cost: 5,
    sphere: 'spirit',
  },
  {
    description:
      "Action: Choose a hero in any player's discard pile. Put that card into play, under its owner's control.",
    action: {
      player: {
        target: 'controller',
        action: {
          chooseCardActions: {
            title: 'Choose hero',
            target: { type: 'hero', zoneType: 'discardPile' },
            action: {
              putInPlay: {
                controllerOf: 'self',
              }, // TODO 2 player test
            },
          },
        },
      },
    },
  }
);

export const loriensWealth = event(
  {
    name: "Lórien's Wealth",
    cost: 3,
    sphere: 'lore',
  },
  {
    description: 'Action: Choose a player. That player draws 3 cards.',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              draw: 3,
            },
          },
        },
      },
    },
  }
);

export const radagastsCunning = event(
  {
    name: "Radagast's Cunning",
    cost: 1,
    sphere: 'lore',
  },
  {
    description:
      'Quest Action: Choose an enemy in the staging area. Until the end of the phase, that enemy does not contribute its [threat].',
    phase: 'quest',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose location',
          target: { type: 'enemy', zoneType: 'stagingArea' },
          action: {
            modify: {
              rule: {
                noThreatContribution: true,
              },
            },
            until: 'end_of_phase',
          },
        },
      },
    },
  }
);

export const secretPaths = event(
  {
    name: 'Secret Paths',
    cost: 1,
    sphere: 'lore',
  },
  {
    description:
      'Quest Action: Choose a location in the staging area. Until the end of the phase, that location does not contribute its [threat].',
    phase: 'quest',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose location',
          target: { type: 'location', zoneType: 'stagingArea' },
          action: {
            modify: {
              rule: {
                noThreatContribution: true,
              },
            },
            until: 'end_of_phase',
          },
        },
      },
    },
  }
);

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

export const beornsHospitality = event(
  {
    name: "Beorn's Hospitality",
    cost: 5,
    sphere: 'lore',
  },
  {
    description:
      'Action: Choose a player. Heal all damage on each hero controlled by that player.',
    action: {
      player: {
        target: 'controller',
        action: {
          choosePlayerActions: {
            title: 'Choose player',
            target: 'each',
            action: {
              controlled: {
                heal: 'all',
              },
            },
          },
        },
      },
    },
  }
);
