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
      hasAttachment: 'self',
    },
    increment: {
      attack: {
        if: {
          cond: {
            card: {
              target: 'target',
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
      hasAttachment: 'self',
    },
    increment: {
      hitPoints: 4,
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
      hasAttachment: 'self',
    },
    increment: {
      attack: {
        if: {
          cond: {
            and: [
              {
                card: {
                  target: 'target',
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
            hasAttachment: 'self',
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

export const stewardOfGondor = attachment(
  {
    name: 'Steward of Gondor',
    unique: true,
    cost: 2,
    traits: ['gondor', 'title'],
    sphere: 'leadership',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gains the Gondor trait.',
    target: {
      hasAttachment: 'self',
    },
    card: {
      description: 'Gains Gondor trait',
      trait: 'gondor',
    },
  },
  {
    description:
      "Action: Exhaust Steward of Gondor to add 2 resources to attached hero's resource pool.",
    action: {
      payment: {
        cost: {
          card: {
            target: 'self',
            action: 'exhaust',
          },
        },
        effect: {
          card: {
            target: { hasAttachment: 'self' },
            action: {
              generateResources: 2,
            },
          },
        },
      },
    },
  }
);

export const celebriansStone = attachment(
  {
    name: "Celebrían's Stone",
    unique: true,
    cost: 2,
    traits: ['artifact', 'item'],
    sphere: 'leadership',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      'Attached hero gains +2 [willpower]. If attached hero is Aragorn, he also gains a [spirit] resource icon.',
    target: {
      hasAttachment: 'self',
    },
    card: [
      {
        description: '+2 [willpower]',
        increment: {
          willpower: 2,
        },
      },
      {
        description: '',
        if: {
          condition: {
            name: 'Aragorn',
          },
          modifier: {
            description: '+[spirit] resource icon',
            addSphere: 'spirit',
          },
        },
      },
    ],
  }
);

export const theFavorOfTheLady = attachment(
  {
    name: 'The Favor of the Lady',
    unique: false,
    cost: 2,
    traits: ['condition'],
    sphere: 'spirit',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gains +1 [willpower].',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      willpower: 1,
    },
  }
);

export const powerInTheEarth = attachment(
  {
    name: 'Power in the Earth',
    unique: false,
    cost: 1,
    traits: ['condition'],
    sphere: 'spirit',
  },
  {
    description: 'Attach to a location.',
    attachesTo: { type: 'location' },
  },
  {
    description: 'Attached location gets -1 [threat]',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      threat: -1,
    },
  }
);

export const unexpectedCourage = attachment(
  {
    name: 'Unexpected Courage',
    unique: false,
    cost: 2,
    traits: ['condition'],
    sphere: 'spirit',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Action: Exhaust Unexpected Courage to ready attached hero.',
    action: {
      payment: {
        cost: {
          card: { target: 'self', action: 'exhaust' },
        },
        effect: {
          card: {
            target: { hasAttachment: 'self' },
            action: 'ready',
          },
        },
      },
    },
  }
);

export const forestSnare = attachment(
  {
    name: 'Forest Snare',
    unique: false,
    cost: 3,
    traits: ['item', 'trap'],
    sphere: 'lore',
  },
  {
    description: 'Attach to an enemy engaged with a player.', // TODO fix attachment zone
    attachesTo: { and: [{ type: 'enemy' }, { zoneType: 'engaged' }] },
  },
  {
    description: 'Attached enemy cannot attack.',
    target: {
      hasAttachment: 'self',
    },
    card: {
      description: 'Cannot attack',
      disable: 'attacking',
    },
  }
);

export const protectorOfLorien = attachment(
  {
    name: 'Protector of Lórien',
    unique: false,
    cost: 1,
    traits: ['title'],
    sphere: 'lore',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description:
      'Action: Discard a card from your hand to give attached hero +1 [defense] or +1 [willpower] until the end of the phase. Limit 3 times per phase.',
    limit: {
      max: 3,
      type: 'phase',
    },
    action: {
      payment: {
        cost: {
          player: {
            target: 'controller',
            action: {
              discard: {
                target: 'choice',
                amount: 1,
              },
            },
          },
        },
        effect: {
          player: {
            target: 'controller',
            action: {
              chooseActions: {
                title: 'Choose bonus',
                actions: [
                  {
                    title: '+1 [defense]',
                    action: {
                      card: {
                        target: {
                          hasAttachment: 'self',
                        },
                        action: {
                          modify: {
                            description: '+1 [defense] until end of phase',
                            increment: {
                              defense: 1,
                            },
                          },
                          until: 'end_of_phase',
                        },
                      },
                    },
                  },
                  {
                    title: '+1 [willpower]',
                    action: {
                      card: {
                        target: {
                          hasAttachment: 'self',
                        },
                        action: {
                          modify: {
                            description: '+1 [willpower] until end of phase',
                            increment: {
                              willpower: 1,
                            },
                          },
                          until: 'end_of_phase',
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
    },
  }
);

export const darkKnowledge = attachment(
  {
    name: 'Dark Knowledge',
    unique: false,
    cost: 1,
    traits: ['condition'],
    sphere: 'lore',
  },
  {
    description: 'Attach to a hero.',
    attachesTo: { type: 'hero' },
  },
  {
    description: 'Attached hero gets -1 [willpower]',
    target: {
      hasAttachment: 'self',
    },
    increment: {
      willpower: -1,
    },
  }
);
// TODO Response: Exhaust Dark Knowledge to look at 1 shadow card that was just dealt to an enemy attacking you.

export const selfPreservation = attachment(
  {
    name: 'Self Preservation',
    unique: false,
    cost: 3,
    traits: ['skill'],
    sphere: 'lore',
  },
  {
    description: 'Attach to a character.',
    attachesTo: 'character',
  },
  {
    description:
      'Action: Exhaust Self Preservation to heal 2 points of damage from attached character.',
    action: {
      payment: {
        cost: {
          card: { target: 'self', action: 'exhaust' },
        },
        effect: {
          card: {
            target: { hasAttachment: 'self' },
            action: { heal: 2 },
          },
        },
      },
    },
  }
);
