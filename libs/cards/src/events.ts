import { event } from '@card-engine-nx/state';

export const loreOfImladris = event(
  {
    name: 'Lore of Imladris',
    cost: 2,
    sphere: 'lore',
  },
  // eventAction({
  //   description:
  //     'Action: Choose a character. Heal all damage from that character.',
  //   effect: chooseCard({
  //     label: 'Choose character to heal',
  //     filter: 'isCharacter',
  //     action: heal('all'),
  //     optional: false,
  //   }),
  // })
);

export const bladeMastery = event(
  {
    name: 'Blade Mastery',
    cost: 1,
    sphere: 'tactics',
  }
  // action({
  //   description:
  //     "Action: Choose a character. Until the end of the phase, that character gains +1 Attack and +1 Defense.",
  //   effect: chooseCardAction(
  //     "Choose character for +1/+1",
  //     isCharacter,
  //     cardActionSequence([
  //       addModifier(increment("attack", 1, "end_of_phase")),
  //       addModifier(increment("defense", 1, "end_of_phase")),
  //     ]),
  //     false
  //   ),
  // })
);

export const feint = event(
  {
    name: 'Feint',
    cost: 1,
    sphere: 'tactics',
  }
  // action({
  //   description:
  //     "Combat Action: Choose an enemy engaged with a player. That enemy cannot attack that player this phase.",
  //   effect: chooseCardAction(
  //     "Choose enemy",
  //     and(isEnemy, isInZoneType("engaged")),
  //     addModifier(cantAttackEngagedPlayer("end_of_phase")),
  //     false
  //   ),
  // })
);

export const quickStrike = event(
  {
    name: 'Quick Strike',
    cost: 1,
    sphere: 'tactics',
  }
  // action({
  //   description:
  //     "Action: Exhaust a character you control to immediately declare it as an attacker (and resolve its attack) against any eligible enemy target.",
  //   effect: chooseCardFor(and(isCharacter, inZone(bindFilter(ofPlayer, ownerOf(self)))), (attacker) =>
  //     pay(
  //       exhaust(attacker),
  //       chooseCardFor(isEnemy, (enemy) => resolvePlayerAttack([attacker], enemy))
  //     )
  //   ),
  // })
);

export const rainOfArrows = event(
  {
    name: 'Rain of Arrows',
    cost: 1,
    sphere: 'tactics',
  }
  // action({
  //   description:
  //     "Action: Exhaust a character you control with the ranged keyword to choose a player. Deal 1 damage to each enemy engaged with that player.",
  //   effect: pay(
  //     chooseCardFor(and(isCharacter, hasKeyword("ranged"), hasController(ownerOf(self))), exhaust),
  //     choosePlayerFor(any(), (player) =>
  //       applyToCards(inZone(and(ofType("engaged"), ofPlayer(player))), dealDamage(1))
  //     )
  //   ),
  // })
);

export const standTogether = event(
  {
    name: 'Stand Together',
    cost: 0,
    sphere: 'tactics',
  }
  // action({
  //   description:
  //     "Action: Choose a player. That player may declare any number of his eligible characters as defenders against each enemy attacking him this phase.",
  //   effect: choosePlayerFor(
  //     any(),
  //     modifyPlayer({
  //       modifier: canDeclareMultipleDefenders,
  //       until: "end_of_phase",
  //     })
  //   ),
  // })
);

export const swiftStrike = event(
  {
    name: 'Swift Strike',
    cost: 2,
    sphere: 'tactics',
  }
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
  }
  // action({
  //   description:
  //     "You must use resources from 3 different heroes' pools to pay for this card. Action: Choose a player. That player's engaged enemies cannot attack that player this phase.",
  //   cost: cost3diffHeroes(3, "tactics")(ownerOf(self)),
  //   effect: choosePlayerFor(any(), (player) =>
  //     applyToCards(
  //       inZone(and(ofType("engaged"), ofPlayer(player))),
  //       modifyCard({
  //         modifier: cantAttackPlayer(player),
  //         until: "end_of_phase",
  //       })
  //     )
  //   ),
  // })
);
