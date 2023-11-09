import { Action, CardTarget } from '@card-engine-nx/state';
import { CardId, PlayerId, Sphere } from '@card-engine-nx/basic';

export function createPlayAttachmentAction(
  sphere: Sphere[],
  cost: number,
  attachesTo: CardTarget,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: owner,
    action: { payResources: { amount: cost, sphere } },
  };

  const attachTo: Action = {
    player: owner,
    action: {
      chooseCardActions: {
        title: 'Choose target for attachment',
        target: {
          and: [attachesTo, 'inAPlay'],
        },
        action: {
          attachCard: self,
        },
      },
    },
  };

  const moveToPlay: Action = {
    card: self,
    action: {
      move: {
        from: { player: owner, type: 'hand' },
        to: { player: owner, type: 'playerArea' },
      },
    },
  };

  return {
    useScope: [
      {
        var: 'self',
        card: self,
      },
      {
        var: 'controller',
        player: owner,
      },
    ],
    action: [
      {
        payment: {
          cost: payment,
          effect: [attachTo, moveToPlay],
        },
      },
    ],
  };
}
