import { hero } from '@card-engine-nx/state';

export const eleanor = hero(
  {
    name: 'Eleanor',
    threatCost: 7,
    willpower: 1,
    attack: 1,
    defense: 2,
    hitPoints: 3,
    traits: ['gondor', 'noble'],
    sphere: 'spirit',
  },
  {
    description:
      'Response: Exhaust Eleanor to cancel the "when revealed" effects of a treachery card just revealed by the encounter deck. Then, discard that card, and replace it with the next card from the encounter deck.',
    target: { type: 'treachery', zoneType: 'encounterDeck' },
    response: {
      event: 'whenRevealed',
      action: [
        {
          card: {
            target: 'self',
            action: 'exhaust',
          },
        },
        { cancel: 'when.revealed' },
        {
          card: {
            target: 'target',
            action: 'discard',
          },
        },
        'revealEncounterCard',
      ],
    },
  }
);
