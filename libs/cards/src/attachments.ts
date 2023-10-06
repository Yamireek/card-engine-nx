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
    response: {
      event: 'destroyed',
      condition: {
        event: {
          type: 'destroyed',
          isAttacker: { hasAttachment: 'self' },
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
            hasAttachment: 'self',
          },
          action: {
            generateResources: 1,
          },
        },
      },
    },
  }
);
