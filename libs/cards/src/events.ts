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
                description:
                  'Has +1 [attack] and +1 [defense] until end of the phase',
                increment: { attack: 1, defense: 1 },
              },
              until: 'end_of_phase',
            },
            multi: false,
            optional: false,
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
              },
              until: 'end_of_phase',
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
              multi: false,
              optional: false,
              target: {
                and: [{ controller: 'controller' }, 'character'],
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
              multi: false,
              optional: false,
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
    phase: 'combat',
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
            optional: false,
            multi: false,
            target: 'each',
            action: {
              engaged: {
                modify: {
                  description: "Can't attack until end of phase",
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

export const everVigilant = event({
  name: 'Ever Vigilant',
  cost: 1,
  sphere: 'leadership',
});
// TODO Action: Choose and ready 1 ally card.

export const commonCause = event({
  name: 'Common Cause',
  cost: 0,
  sphere: 'leadership',
});
// TODO Action: Exhaust 1 hero you control to choose and ready a different hero.

export const forGondor = event({
  name: 'For Gondor!',
  cost: 2,
  sphere: 'leadership',
});
// TODO Action: Until the end of the phase, all characters get +1 [attack]. All Gondor characters also get +1 [defense] until the end of the phase.

export const sneakAttack = event({
  name: 'Sneak Attack',
  cost: 1,
  sphere: 'leadership',
});
// TODO Action: Put 1 ally card into play from your hand. At the end of the phase, if that ally is still in play, return it to your hand.

export const valiantSacrifice = event({
  name: 'Valiant Sacrifice',
  cost: 1,
  sphere: 'leadership',
});
// TODO Response: After an ally card leaves play, that card's controller draws 2 cards.

export const grimResolve = event({
  name: 'Grim Resolve',
  cost: 5,
  sphere: 'leadership',
});
// TODO Action: Ready all character cards in play.

export const theGaladhrimsGreeting = event({
  name: "The Galadhrim's Greeting",
  cost: 3,
  sphere: 'spirit',
});
// TODO Action: Reduce one player's threat by 6, or reduce each player's threat by 2.

export const strengthOfWill = event({
  name: 'Strength of Will',
  cost: 0,
  sphere: 'spirit',
});
// TODO Response: After you travel to a location, exhaust a [spirit] character to place 2 progress tokens on that location.

export const hastyStroke = event({
  name: 'Hasty Stroke',
  cost: 1,
  sphere: 'spirit',
});
// TODO Response: Cancel a shadow effect just triggered during combat.

export const willOfTheWest = event({
  name: 'Will of the West',
  cost: 1,
  sphere: 'spirit',
});
// TODO Action: Choose a player. Shuffle that player's discard pile back into his deck. Remove Will of the West from the game.

export const aTestOfWill = event({
  name: 'A Test of Will',
  cost: 1,
  sphere: 'spirit',
});
// TODO Response: Cancel the “when revealed” effects of a card that was just revealed from the encounter deck.

export const standAndFight = event({
  name: 'Stand and Fight',
  cost: 0, // TODO X cost,
  sphere: 'spirit',
});
// TODO Action: Choose an ally with a printed cost of X in any player's discard pile. Put that ally into play under your control. (The chosen ally can belong to any sphere of influence.)

export const aLightInIheDark = event({
  name: 'A Light in the Dark',
  cost: 2,
  sphere: 'spirit',
});
// TODO Action: Choose an enemy engaged with a player. Return that enemy to the staging area.

export const dwarvenTomb = event({
  name: 'Dwarven Tomb',
  cost: 1,
  sphere: 'spirit',
});
// TODO Action: Return 1 [spirit] card from your discard pile to your hand.

export const fortuneOrFate = event({
  name: 'Fortune or Fate',
  cost: 5,
  sphere: 'spirit',
});
// TODO Action: Choose a hero in any player's discard pile. Put that card into play, under its owner's control.

export const loriensWealth = event({
  name: "Lórien's Wealth",
  cost: 3,
  sphere: 'lore',
});
// TODO Action: Choose a player. That player draws 3 cards.

export const radagastsCunning = event({
  name: "Radagast's Cunning",
  cost: 1,
  sphere: 'lore',
});
// TODO Quest Action: Choose an enemy in the staging area. Until the end of the phase, that enemy does not contribute its [threat].

export const secretPaths = event({
  name: 'Secret Paths',
  cost: 1,
  sphere: 'lore',
});
// TODO Quest Action: Choose a location in the staging area. Until the end of the phase, that location does not contribute its [threat].

export const gandalfsSearch = event({
  name: "Gandalf's Search",
  cost: 0, // TODO X cost
  sphere: 'lore',
});
// TODO Action: Look at the top X cards of any player's deck, add 1 of those cards to its owner's hand, and return the rest to the top of the deck in any order.

export const beornsHospitality = event({
  name: "Beorn's Hospitality",
  cost: 5,
  sphere: 'lore',
});
// TODO Action: Choose a player. Heal all damage on each hero controlled by that player.
