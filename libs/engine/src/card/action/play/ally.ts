import { Action } from '@card-engine-nx/state';
import { CardId, PlayerId, Sphere } from '@card-engine-nx/basic';

export function createPlayAllyAction(
  sphere: Sphere[],
  cost: number,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: owner,
    action: { payResources: { amount: cost, sphere } },
  };

  const moveToPlay: Action = {
    card: {
      target: self,
      action: {
        move: {
          from: { player: owner, type: 'hand' },
          to: { player: owner, type: 'playerArea' },
        },
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
    action: {
      payment: {
        cost: payment,
        effect: [moveToPlay, { event: { type: 'played', card: self } }],
      },
    },
  };
}
