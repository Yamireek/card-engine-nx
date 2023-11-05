import { event } from '@card-engine-nx/state';

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
