import {
  PlayerState,
  PlayerAction,
  CardTarget,
  Action,
} from '@card-engine-nx/state';
import { calculateNumberExpr } from '../expr';
import { ExecutionContext } from '../context';
import { getTargetCard } from '../card';
import { max, sum } from 'lodash/fp';
import { sequence } from '../utils/sequence';
import { getTargetPlayer } from './target';

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
    zone.cards = ctx.shuffle(zone.cards);
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
              action: {
                sequence: [
                  'exhaust',
                  {
                    mark: 'questing',
                  },
                ],
              },
            },
          },
        },
      },
      ...ctx.state.next,
    ];
    return;
  }

  if (action === 'engagementCheck') {
    const threat = player.thread;
    const enemies = getTargetCard(
      {
        and: [{ type: 'enemy' }, { zone: 'stagingArea' }],
      },
      ctx
    ).map((id) => ctx.view.cards[id]);

    const maxEngagement = max(
      enemies

        .filter((e) => e.props.engagement && e.props.engagement <= threat)
        .map((e) => e.props.engagement)
    );

    if (maxEngagement === undefined) {
      return;
    }

    const enemyChoices = enemies.filter(
      (e) => e.props.engagement === maxEngagement
    );

    ctx.state.next.unshift({
      player: {
        target: player.id,
        action: {
          chooseCardActions: {
            title: 'Choose enemy to engage',
            target: enemyChoices.map((e) => e.id),
            multi: false,
            optional: false,
            action: {
              engagePlayer: player.id,
            },
          },
        },
      },
    });
    return;
  }

  if (action === 'optionalEngagement') {
    ctx.state.next.unshift({
      player: {
        target: player.id,
        action: {
          chooseCardActions: {
            title: 'Choose enemy to optionally engage',
            optional: true,
            multi: false,
            target: {
              and: [{ type: 'enemy' }, { zone: 'stagingArea' }],
            },
            action: {
              engagePlayer: player.id,
            },
          },
        },
      },
    });
    return;
  }

  if (action === 'resolveEnemyAttacks') {
    const filter: CardTarget = {
      and: [
        { type: 'enemy' },
        { not: { mark: 'attacked' } },
        { zone: { owner: player.id, type: 'engaged' } },
      ],
    };

    ctx.state.next.unshift({
      while: {
        condition: { someCard: filter },
        action: {
          player: {
            target: player.id,
            action: {
              chooseCardActions: {
                title: 'Choose enemy attacker',
                target: filter,
                multi: false,
                optional: false,
                action: {
                  resolveEnemyAttacking: player.id,
                },
              },
            },
          },
        },
      },
    });
    return;
  }

  if (action === 'resolvePlayerAttacks') {
    const enemies = getTargetCard(
      {
        and: [
          { type: 'enemy' },
          { not: { mark: 'attacked' } },
          { zone: { owner: player.id, type: 'engaged' } },
        ],
      },
      ctx
    );

    const attackers = getTargetCard(
      {
        and: [
          'ready',
          'character',
          { zone: { owner: player.id, type: 'playerArea' } },
        ],
      },
      ctx
    );

    if (enemies && attackers && attackers.length > 0 && enemies.length > 0) {
      ctx.state.next.unshift({
        player: {
          target: player.id,
          action: {
            chooseActions: {
              title: 'Choose enemy to attack',
              multi: false,
              actions: enemies.map((e) => ({
                title: e.toString(),
                cardId: e,
                action: sequence(
                  {
                    card: {
                      taget: e,
                      action: { resolvePlayerAttacking: player.id },
                    },
                  },
                  {
                    player: {
                      target: player.id,
                      action: 'resolvePlayerAttacks',
                    },
                  }
                ),
              })),
              optional: true,
            },
          },
        },
      });
    }

    return;
  }

  if (action === 'declareDefender') {
    ctx.state.next.unshift({
      player: {
        target: player.id,
        action: {
          chooseCardActions: {
            title: 'Declare defender',
            target: {
              and: [
                'character',
                'ready',
                { zone: { owner: player.id, type: 'playerArea' } },
              ],
            },
            multi: false,
            optional: true,
            action: {
              sequence: ['exhaust', { mark: 'defending' }],
            },
          },
        },
      },
    });
    return;
  }

  if (action === 'determineCombatDamage') {
    const attacking = getTargetCard({ mark: 'attacking' }, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const defending = getTargetCard({ mark: 'defending' }, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const attack = sum(attacking.map((a) => a.props.attack || 0));
    const defense = sum(defending.map((d) => d.props.defense || 0));

    if (
      defending.length === 0 &&
      attacking.some((a) => a.props.type === 'enemy')
    ) {
      ctx.state.next.unshift({
        player: {
          target: player.id,
          action: {
            chooseCardActions: {
              title: 'Choose hero for undefended attack',
              target: {
                and: [
                  { type: 'hero' },
                  { zone: { owner: player.id, type: 'playerArea' } },
                ],
              },
              multi: false,
              optional: false,
              action: {
                dealDamage: attack,
              },
            },
          },
        },
      });
    } else {
      const damage = attack - defense;
      if (damage > 0) {
        if (defending.length === 1) {
          ctx.state.next.unshift({
            card: {
              taget: defending.map((c) => c.id),
              action: { dealDamage: damage },
            },
          });
        } else {
          // TODO multiple defenders
        }
      }
    }
    return;
  }

  if (action === 'eliminate') {
    player.eliminated = true;
    ctx.state.next.unshift({
      card: { taget: { owner: player.id }, action: 'destroy' },
    });
    return;
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
        { type: 'hero' },
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

    const cardAction = action.chooseCardActions.action;

    ctx.state.choice = {
      id: ctx.state.nextId++,
      player: player.id,
      dialog: true,
      title: action.chooseCardActions.title,
      multi: action.chooseCardActions.multi,
      optional: action.chooseCardActions.optional,
      options: cardIds.map((c) => ({
        title: c.toString(),
        cardId: c,
        action: {
          card: {
            taget: c,
            action: cardAction,
          },
        },
      })),
    };
    return;
  }

  if (action.choosePlayerActions) {
    const playerIds = getTargetPlayer(
      {
        and: [
          action.choosePlayerActions.target,
          {
            canExecute: action.choosePlayerActions.action,
          },
        ],
      },
      ctx
    );

    const playerAction = action.choosePlayerActions.action;

    ctx.state.choice = {
      id: ctx.state.nextId++,
      player: player.id,
      dialog: true,
      title: action.choosePlayerActions.title,
      multi: action.choosePlayerActions.multi,
      optional: action.choosePlayerActions.optional,
      options: playerIds.map((c) => ({
        title: c.toString(),
        action: {
          player: {
            target: c,
            action: playerAction,
          },
        },
      })),
    };
    return;
  }

  if (action.chooseActions) {
    ctx.state.choice = {
      id: ctx.state.nextId++,
      player: player.id,
      dialog: true,
      title: action.chooseActions.title,
      multi: action.chooseActions.multi,
      optional: action.chooseActions.optional,
      options: action.chooseActions.actions,
    };
    return;
  }

  if (action.discard) {
    ctx.state.next.unshift({
      repeat: {
        amount: action.discard,
        action: {
          player: {
            target: player.id,
            action: {
              chooseCardActions: {
                title: 'Choose card to discard',
                target: { zone: { owner: player.id, type: 'hand' } },
                action: {
                  move: {
                    from: { owner: player.id, type: 'hand' },
                    to: { owner: player.id, type: 'discardPile' },
                    side: 'front',
                  },
                },
                multi: false,
                optional: false,
              },
            },
          },
        },
      },
    });
    return;
  }

  if (action.declareAttackers) {
    ctx.state.next.unshift({
      player: {
        target: player.id,
        action: {
          chooseCardActions: {
            title: 'Declare attackers',
            target: {
              and: ['character', 'inAPlay', { owner: player.id }],
            },
            action: {
              sequence: [{ mark: 'attacking' }, 'exhaust'],
            },
            multi: true,
            optional: true,
          },
        },
      },
    });
    return;
  }

  if (action.sequence) {
    const actions: Action[] = action.sequence.map((a) => ({
      player: { target: player.id, action: a },
    }));

    ctx.state.next.unshift(...actions);
    return;
  }

  if (action.setLimit) {
    player.limits[action.setLimit.key] = action.setLimit.limit;
    return;
  }

  throw new Error(`unknown player action: ${JSON.stringify(action)}`);
}
