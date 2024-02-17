import { treachery } from '@card-engine-nx/state';

export const caughtInAWeb = treachery(
  { name: 'Caught in a Web' },
  {
    description:
      "When Revealed: The player with the highest threat level attaches this card to one of his heroes. (Counts as a Condition attachment with the text: 'Attached hero does not ready during the refresh phase unless you pay 2 resources from that hero's pool.')",
    multi: [
      {
        description: '',
        whenRevealed: {
          player: 'highestThreat',
          action: [
            {
              chooseCardActions: {
                title: 'Choose hero',
                target: { type: 'hero', controller: 'highestThreat' },
                action: [{ attachCard: 'self' }],
              },
            },
          ],
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
          rule: {
            refreshCost: [{ payResources: 2 }],
          },
        },
      },
    ],
  }
);
