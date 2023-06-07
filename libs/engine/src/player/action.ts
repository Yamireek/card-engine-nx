import { PlayerState, PlayerAction, CardTarget } from '@card-engine-nx/state';
import { shuffle } from 'lodash';
import { calculateNumberExpr } from '../expr';
import { ExecutionContext } from '../context';
import { getTargetCard } from '../card';
import { v4 as uuid } from 'uuid';

export function executePlayerAction(
  action: PlayerAction,
  player: PlayerState,
  ctx: ExecutionContext
) {
  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleLibrary') {
    const zone = player.zones['library'];
    zone.cards = shuffle(zone.cards);
    return;
  }

  if (action === 'commitCharactersToQuest') {
    ctx.state.next = [
      {
        player: {
          target: player.id,
          action: {
            chooseCardActions: {
              title: 'Choose characters commiting to quest',
              multi: true,
              optional: true,
              target: { and: ['character', { controller: player.id }] },
              action: 'commitToQuest',
            },
          },
        },
      },
      ...ctx.state.next,
    ];
    return;
  }

  if (action === 'engagementCheck') {
    throw new Error('not implemented');
  }

  if (action === 'optionalEngagement') {
    throw new Error('not implemented');
  }

  if (action === 'resolveEnemyAttacks') {
    throw new Error('not implemented');
  }

  if (action === 'resolvePlayerAttacks') {
    throw new Error('not implemented');
  }

  if (action.draw) {
    ctx.state.next = [
      {
        repeat: {
          amount: action.draw,
          action: {
            card: {
              taget: {
                top: { player: { id: player.id, zone: 'library' } },
              },
              action: {
                move: {
                  from: { owner: player.id, type: 'library' },
                  to: { owner: player.id, type: 'hand' },
                  side: 'front',
                },
              },
            },
          },
        },
      },
      ...ctx.state.next,
    ];
    return;
  }

  if (action.incrementThreat) {
    const amount = calculateNumberExpr(action.incrementThreat, ctx);
    player.thread += amount;
    return;
  }

  if (action.payResources) {
    const sphere =
      action.payResources.sphere === 'neutral'
        ? 'any'
        : action.payResources.sphere;

    const target: CardTarget = {
      and: [
        { type: ['hero'] },
        { owner: player.id },
        {
          sphere,
        },
      ],
    };

    ctx.state.next = [
      {
        repeat: {
          amount: action.payResources.amount,
          action: {
            player: {
              target: player.id,
              action: {
                chooseCardActions: {
                  title: 'Choose hero to pay 1 resource',
                  target,
                  action: { payResources: 1 },
                  multi: false,
                  optional: false,
                },
              },
            },
          },
        },
      },
      ...ctx.state.next,
    ];
    return;
  }

  if (action.chooseCardActions) {
    const cardIds = getTargetCard(
      {
        and: [
          action.chooseCardActions.target,
          {
            canExecute: action.chooseCardActions.action,
          },
        ],
      },
      ctx
    );

    ctx.state.choice = {
      id: uuid(),
      dialog: true,
      title: action.chooseCardActions.title,
      multi: action.chooseCardActions.multi,
      options: cardIds.map((c) => ({
        title: c.toString(),
        cardId: c,
        action: {
          card: {
            taget: c,
            action: action.chooseCardActions?.action ?? 'empty',
          },
        },
      })),
    };
    return;
  }

  throw new Error(`unknown player action: ${JSON.stringify(action)}`);
}
