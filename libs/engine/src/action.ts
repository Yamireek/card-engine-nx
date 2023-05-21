import { CardAction } from '@card-engine-nx/state';

export function executeAction(action: CardAction) {
  if (action === 'empty') {
    return;
  }

  throw new Error(`unknown  action: ${JSON.stringify(action)}`);
}
