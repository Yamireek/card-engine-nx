import { attachment } from '@card-engine-nx/state';

export const dwarvenAxe = attachment(
  {
    name: 'Dwarven Axe',
    unique: false,
    cost: 2,
    traits: ['item', 'weapon'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      'Attached hero gains +1 ATT (+2 ATT instead if attached hero is a Dwarf.)',
    target: {
      hasAttachment: 'source',
    },
    bonus: {
      property: 'attack',
      amount: {
        if: {
          cond: {
            card: {
              target: 'self',
              value: { hasTrait: 'dwarf' },
            },
          },
          true: 2,
          false: 1,
        },
      },
    },
  }
);

export const citadelPlate = attachment(
  {
    name: 'Citadel Plate',
    unique: false,
    cost: 4,
    traits: ['item', 'armor'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gets +4 Hit Points.',
    target: {
      hasAttachment: 'source',
    },
    bonus: {
      property: 'hitPoints',
      amount: 4,
    },
  }
);

export const bladeOfGondolin = attachment(
  {
    name: 'Blade of Gondolin',
    unique: false,
    cost: 1,
    traits: ['item', 'weapon'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gets +1 Attack when attacking an Orc.',
    target: {
      hasAttachment: 'source',
    },
    bonus: {
      property: 'attack',
      amount: {
        if: {
          cond: {
            and: [
              {
                card: {
                  target: 'self',
                  value: { hasMark: 'attacking' },
                },
              },
              {
                someCard: {
                  and: [{ mark: 'defending' }, { trait: 'orc' }],
                },
              },
            ],
          },
          true: 1,
          false: 0,
        },
      },
    },
  },
  {
    description:
      'Response: After attached hero attacks and destroys an enemy, place 1 progress token on the current quest.',
    target: {
      type: 'enemy',
    },
    response: {
      event: 'destroyed',
      condition: {
        event: {
          type: 'destroyed',
          isAttacker: {
            hasAttachment: 'source',
          },
        },
      },
      action: {
        placeProgress: 1,
      },
    },
  }
);

export const hornOfGondor = attachment(
  {
    name: 'Horn of Gondor',
    unique: true,
    cost: 1,
    traits: ['item', 'artifact'],
    sphere: 'tactics',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      "Response: After a character is destroyed, add 1 resource to attached hero's pool.",
    target: 'character',
    response: {
      event: 'destroyed',
      condition: {
        card: {
          target: 'event',
          value: {
            isType: 'character',
          },
        },
      },
      action: {
        card: {
          target: {
            hasAttachment: 'source',
          },
          action: {
            generateResources: 1,
          },
        },
      },
    },
  }
);

export const stowardOfGondor = attachment({
  name: 'Steward of Gondor',
  unique: true,
  cost: 2,
  traits: ['gondor', 'title'],
  sphere: 'leadership',
});
// TODO Attach to a hero.
// TODO Attached hero gains the Gondor trait.
// TODO Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool.

export const celebriansStore = attachment({
  name: "Celebrían's Stone",
  unique: true,
  cost: 2,
  traits: ['artifact', 'item'],
  sphere: 'leadership',
});
// TODO Attach to a hero. Restricted.
// TODO Attached hero gains +2 [willpower].
// TODO If attached hero is Aragorn, he also gains a [spirit] resource icon.

export const theFavorOfTheLady = attachment({
  name: 'The Favor of the Lady',
  unique: false,
  cost: 2,
  traits: ['condition'],
  sphere: 'spirit',
});
// TODO Attach to a hero.
// TODO Attached hero gains +1 [willpower].

export const powerInTheEarth = attachment({
  name: 'Power in the Earth',
  unique: false,
  cost: 1,
  traits: ['condition'],
  sphere: 'spirit',
});
// TODO Attach to a location.
// TODO Attached location gets -1 [threat].

export const unexpectedCourage = attachment({
  name: 'Unexpected Courage',
  unique: false,
  cost: 2,
  traits: ['condition'],
  sphere: 'spirit',
});
// TODO Attach to a hero.
// TODO Action: Exhaust Unexpected Courage to ready attached hero.

export const forestSnare = attachment({
  name: 'Forest Snare',
  unique: false,
  cost: 3,
  traits: ['item', 'trap'],
  sphere: 'lore',
});
// TODO Attach to an enemy engaged with a player.
// TODO Attached enemy cannot attack.

export const protectorOfLorien = attachment({
  name: 'Protector of Lórien',
  unique: false,
  cost: 1,
  traits: ['title'],
  sphere: 'lore',
});
// TODO Attach to a hero.
// TODO Action: Discard a card from your hand to give attached hero +1 [defense] or +1 [willpower] until the end of the phase. Limit 3 times per phase.

export const darkKnowledge = attachment({
  name: 'Dark Knowledge',
  unique: false,
  cost: 1,
  traits: ['condition'],
  sphere: 'lore',
});
// TODO Attach to a hero. Attached hero gets -1 [willpower]
// TODO Response: Exhaust Dark Knowledge to look at 1 shadow card that was just dealt to an enemy attacking you.

export const selfPreservation = attachment({
  name: 'Self Preservation',
  unique: false,
  cost: 3,
  traits: ['skill'],
  sphere: 'lore',
});
// TODO Attach to a character.
// TODO Action: Exhaust Self Preservation to heal 2 points of damage from attached character.
