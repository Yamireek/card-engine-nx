import { treachery } from '@card-engine-nx/state';

export const drivenByShadow = treachery(
  {
    name: 'Driven by Shadow',
  },
  {
    description:
      'When Revealed: Each enemy and each location currently in the staging area gets +1 Threat until the end of the phase.',
    whenRevealed: {
      card: { type: ['location', 'enemy'], zoneType: 'stagingArea' },
      action: {
        modify: {
          increment: {
            threat: 1,
          },
        },
        until: 'end_of_phase',
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
      add: {
        keyword: {
          surge: true,
        },
      },
    },
  },
  {
    description:
      'Shadow: Choose and discard 1 attachment from the defending character. (If this attack is undefended, discard all attachments you control.)',
    shadow: {
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
  }
);
