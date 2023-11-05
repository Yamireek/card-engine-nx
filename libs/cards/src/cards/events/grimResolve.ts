import { event } from '@card-engine-nx/state';

export const grimResolve = event(
  {
    name: 'Grim Resolve',
    cost: 5,
    sphere: 'leadership',
  },
  {
    description: 'Action: Ready all character cards in play.',
    action: {
      card: {
        target: 'character',
        action: 'ready',
      },
    },
  }
);
