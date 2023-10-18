import { treachery } from '@card-engine-nx/state';

export const eyesOfTheForest = treachery(
  { name: 'Eyes of the Forest' },
  {
    description:
      'When Revealed: Each player discards all event cards in his hand.',
    whenRevealed: {
      card: {
        target: { and: [{ type: 'event' }, { zoneType: 'hand' }] },
        action: 'discard',
      },
    },
  }
);

export const caughtInAWeb = treachery(
  { name: 'Caught in a Web' },
  {
    description:
      "When Revealed: The player with the highest threat level attaches this card to one of his heroes. (Counts as a Condition attachment with the text: 'Attached hero does not ready during the refresh phase unless you pay 2 resources from that hero's pool.')",
    multi: [
      {
        description: '',
        whenRevealed: {
          player: {
            target: 'highestThreat',
            action: [
              {
                chooseCardActions: {
                  title: 'Choose hero',
                  target: {
                    and: [{ type: 'hero', controller: 'highestThreat' }],
                  },
                  action: [{ attachCard: 'self' }],
                },
              },
            ],
          },
        },
      },
      {
        description: '',
        card: {
          if: {
            condition: {
              predicate: 'isAttached',
            },
            true: [
              {
                replaceType: 'attachment',
              },
              { addTrait: 'condition' },
            ],
          },
        },
      },
      {
        description: '',
        target: {
          hasAttachment: 'self',
        },
        card: {
          refreshCost: { payResources: 2 },
        },
      },
    ],
  }
);

export const drivenByShadow = treachery(
  {
    name: 'Driven by Shadow',
    shadow: {
      description:
        'Shadow: Choose and discard 1 attachment from the defending character. (If this attack is undefended, discard all attachments you control.)',
      action: {
        if: {
          condition: 'undefended.attack',
          true: {
            card: { controller: 'defending', type: 'attachment' },
            action: 'discard',
          },
          false: {
            player: 'defending',
            action: {
              chooseCardActions: {
                title: 'Choose attachment to discard',
                target: {
                  attachmentOf: {
                    mark: 'defending',
                  },
                },
                action: 'discard',
              },
            },
          },
        },
      },
    },
  },
  {
    description:
      'When Revealed: Each enemy and each location currently in the staging area gets +1 Threat until the end of the phase.',
    whenRevealed: {
      card: {
        target: {
          and: [{ type: ['location', 'enemy'] }, { zoneType: 'stagingArea' }],
        },
        action: {
          modify: {
            description: '+1 [thread] until the end of the phase',
            increment: {
              threat: 1,
            },
          },
          until: 'end_of_phase',
        },
      },
    },
  },
  {
    description:
      'If there are no cards in the staging area, Driven by Shadow gains Surge.',
    condition: {
      eq: [0, { count: { cards: { zoneType: 'stagingArea' } } }],
    },
    card: {
      description: 'Surge',
      keywords: {
        surge: true,
      },
    },
  }
);

export const theNecromancersReach = treachery(
  {
    name: "The Necromancer's Reach",
  },
  {
    description: 'When Revealed: Deal 1 damage to each exhausted character.',
    whenRevealed: {
      card: {
        target: { and: ['character', 'exhausted'] },
        action: {
          dealDamage: 1,
        },
      },
    },
  }
);
