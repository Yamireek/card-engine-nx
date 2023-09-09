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
  }
  // modifyAttached({
  //   description: "Attached hero gains +1 ATT (+2 ATT instead if attached hero is a Dwarf.)",
  //   modifier: dynamicModifier(hasTrait("dwarf"), (isDwarf) => increment("attack")(isDwarf ? 2 : 1)),
  // })
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
  }
  // modifyAttached({
  //   description: "Attached hero gets +4 Hit Points.",
  //   modifier: increment("hitPoints")(4),
  // })
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
  }
  // modifyAttached({
  //   description: "Attached hero gets +1 Attack when attacking an Orc.",
  //   modifier: attackBonus(hasTrait("orc"), 1),
  // }),
  // response({
  //   description:
  //     "Response: After attached hero attacks and destroys an enemy, place 1 progress token on the current quest.",
  //   event: destroyed(),
  //   condition: (e, v) => e.attackers.includes(attached(self).eval(v)),
  //   action: () => placeProgress(1),
  // })
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
  }
  // response({
  //   description: "Response: After a character is destroyed, add 1 resource to attached hero's pool.",
  //   event: destroyed(),
  //   condition: (e, v) => isCharacter(e.cardId).eval(v),
  //   action: () => bindAction(attached(self), addResources(1)),
  // })
);
