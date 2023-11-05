import { attachment } from '@card-engine-nx/state';

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
