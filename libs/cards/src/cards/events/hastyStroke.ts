import { event } from '@card-engine-nx/state';

export const hastyStroke = event(
  {
    name: 'Hasty Stroke',
    cost: 1,
    sphere: 'spirit',
  },
  {
    description:
      'Response: Cancel a shadow effect just triggered during combat.',
    response: {
      event: 'shadow',
      action: {
        cancel: 'shadow',
      },
    },
  }
);
