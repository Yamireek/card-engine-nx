import {
  PlayerState,
  PlayerAction,
  CardTarget,
  Action,
  CardAction,
  Event,
} from '@card-engine-nx/state';
import { calculateNumberExpr } from '../expr';
import { ExecutionContext } from '../context';
import { getTargetCard, getTargetCards } from '../card';
import { isArray, max, sum } from 'lodash/fp';
import { getTargetPlayers } from './target';
import { canCardExecute, canExecute, canPlayerExecute } from '../resolution';

export function executePlayerAction(
  action: PlayerAction,
  player: PlayerState,
  ctx: ExecutionContext
) {
  if (isArray(action)) {
    const actions: Action[] = action.map((a) => ({
      player: { target: player.id, action: a },
    }));

    ctx.state.next.unshift(...actions);
    return;
  }

  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleLibrary') {
    const zone = player.zones['library'];
    zone.cards = ctx.random.shuffle(zone.cards);
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
              action: [
                'exhaust',
                {
                  mark: 'questing',
                },
              ],
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
    const enemies = getTargetCards(
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
        { enabled: 'attacking' },
        { zone: { player: player.id, type: 'engaged' } },
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
    const enemies = getTargetCards(
      {
        and: [
          { type: 'enemy' },
          { not: { mark: 'attacked' } },
          { zone: { player: player.id, type: 'engaged' } },
        ],
      },
      ctx
    );

    const attackers = getTargetCards(
      {
        and: [
          'ready',
          'character',
          { zone: { player: player.id, type: 'playerArea' } },
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
                action: [
                  {
                    card: {
                      target: e,
                      action: { resolvePlayerAttacking: player.id },
                    },
                  },
                  {
                    player: {
                      target: player.id,
                      action: 'resolvePlayerAttacks',
                    },
                  },
                ],
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
    const multiple = !!ctx.view.players[player.id]?.multipleDefenders;
    const attacker = getTargetCard({ mark: 'attacking' }, ctx);

    if (attacker) {
      ctx.state.next.unshift({
        player: {
          target: player.id,
          action: {
            chooseCardActions: {
              title: !multiple ? 'Declare defender' : 'Declare defenders',
              target: {
                and: [
                  'character',
                  'ready',
                  { zone: { player: player.id, type: 'playerArea' } },
                ],
              },
              multi: multiple,
              optional: true,
              action: {
                declareAsDefender: {
                  attacker,
                },
              },
            },
          },
        },
      });
    }

    return;
  }

  if (action === 'determineCombatDamage') {
    const attacking = getTargetCards({ mark: 'attacking' }, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const defending = getTargetCards({ mark: 'defending' }, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const attack = sum(attacking.map((a) => a.props.attack || 0));
    const defense = sum(defending.map((d) => d.props.defense || 0));

    ctx.state.next.unshift(
      ...attacking.map((a) => {
        const event: Event = { type: 'attacked', card: a.id };
        return { event };
      })
    );

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
                  { zone: { player: player.id, type: 'playerArea' } },
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
              target: defending.map((c) => c.id),
              action: { dealDamage: damage },
            },
          });
        }

        if (defending.length === 0) {
          // TODO undefended
        }

        if (defending.length > 1) {
          ctx.state.next.unshift({
            player: {
              target: player.id,
              action: {
                chooseCardActions: {
                  title: 'Choose character for damage',
                  multi: false,
                  optional: false,
                  target: defending.map((c) => c.id),
                  action: {
                    dealDamage: damage,
                  },
                },
              },
            },
          });
        }
      }
    }
    return;
  }

  if (action === 'eliminate') {
    player.eliminated = true;
    ctx.state.next.unshift({
      card: { target: { owner: player.id }, action: 'destroy' },
    });
    return;
  }

  if (action.draw) {
    const owner = ctx.view.players[player.id];
    if (owner?.disableDraw) {
      return;
    }

    ctx.state.next = [
      {
        repeat: {
          amount: action.draw,
          action: {
            card: {
              target: {
                top: { player: { id: player.id, zone: 'library' } },
              },
              action: {
                move: {
                  from: { player: player.id, type: 'library' },
                  to: { player: player.id, type: 'hand' },
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

  if (action.deck) {
    ctx.state.next.unshift({
      card: { target: player.zones.library.cards, action: action.deck },
    });
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

    const targets = getTargetCards(target, ctx);

    const options = targets.flatMap((t) => {
      const card = ctx.state.cards[t];
      if (card.token.resources === 0) {
        return [];
      }
      return {
        title: t.toString(),
        cardId: t,
        min: 0,
        max: card.token.resources,
        action: {
          card: {
            target: t,
            action: { payResources: 1 },
          },
        },
      };
    });

    if (options.length === 1) {
      ctx.state.next.unshift({
        card: {
          target: options[0].cardId,
          action: { payResources: action.payResources.amount },
        },
      });
      return;
    }

    if (
      options.length === action.payResources.heroes &&
      options.length === action.payResources.amount
    ) {
      ctx.state.next.unshift({
        card: {
          target: options.map((o) => o.cardId),
          action: { payResources: 1 },
        },
      });
      return;
    }

    ctx.state.next.unshift('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        player: player.id,
        type: 'split',
        amount: action.payResources.amount,
        title: `Choose how pay ${action.payResources.amount} ${action.payResources.sphere} resources`,
        options,
        count: {
          min: action.payResources.heroes ?? 1,
        },
      },
    });

    return;
  }

  if (action.chooseCardActions) {
    const cardIds = getTargetCards(action.chooseCardActions.target, ctx);
    const cardAction = action.chooseCardActions.action;
    if (cardIds.length === 0) {
      return;
    }

    ctx.state.next.unshift('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        player: player.id,
        title: action.chooseCardActions.title,
        type: action.chooseCardActions.multi ? 'multi' : 'single',
        optional: action.chooseCardActions.optional,
        options: cardIds
          .filter((id) => canCardExecute(cardAction, id, ctx))
          .map((c) => ({
            title: c.toString(),
            cardId: c,
            action: {
              card: {
                target: c,
                action: cardAction,
              },
            },
          })),
      },
    });

    return;
  }

  if (action.choosePlayerActions) {
    const playerIds = getTargetPlayers(action.choosePlayerActions.target, ctx);
    const playerAction = action.choosePlayerActions.action;

    if (playerIds.length == 0) {
      return;
    }

    ctx.state.next.unshift('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        player: player.id,
        title: action.choosePlayerActions.title,
        type: action.choosePlayerActions.multi ? 'multi' : 'single',
        optional: action.choosePlayerActions.optional,
        options: playerIds
          .filter((p) => canPlayerExecute(playerAction, p, ctx))
          .map((c) => ({
            title: c.toString(),
            action: {
              player: {
                target: c,
                action: playerAction,
              },
            },
          })),
      },
    });

    return;
  }

  if (action.chooseActions) {
    const options = action.chooseActions.actions.filter((a) =>
      canExecute(a.action, false, ctx)
    );

    ctx.state.next.unshift('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        player: player.id,
        title: action.chooseActions.title,
        type: action.chooseActions.multi ? 'multi' : 'single',
        optional: action.chooseActions.optional,
        options,
      },
    });

    return;
  }

  if (action.discard) {
    const target: CardTarget = { zone: { player: player.id, type: 'hand' } };
    const discard: CardAction = {
      move: {
        from: { player: player.id, type: 'hand' },
        to: { player: player.id, type: 'discardPile' },
        side: 'front',
      },
    };

    if (action.discard.target === 'choice') {
      ctx.state.next.unshift({
        repeat: {
          amount: action.discard.amount,
          action: {
            player: {
              target: player.id,
              action: {
                chooseCardActions: {
                  title: 'Choose card to discard',
                  target,
                  action: discard,
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

    if (action.discard.target === 'random') {
      const cards = getTargetCards(target, ctx);
      const choosen = ctx.random.shuffle(cards).slice(0, action.discard.amount);
      ctx.state.next.unshift({
        card: {
          target: choosen,
          action: discard,
        },
      });

      return;
    }
  }

  if (action.declareAttackers) {
    ctx.state.next.unshift({
      player: {
        target: player.id,
        action: {
          chooseCardActions: {
            title: 'Declare attackers',
            target: {
              and: ['character', { controller: player.id }],
            },
            action: [{ mark: 'attacking' }, 'exhaust'],
            multi: true,
            optional: true,
          },
        },
      },
    });
    return;
  }

  if (action.setLimit) {
    player.limits[action.setLimit.key] = action.setLimit.limit;
    return;
  }

  if (action.engaged) {
    ctx.state.next.unshift({
      card: {
        action: action.engaged,
        target: {
          zone: {
            player: player.id,
            type: 'engaged',
          },
        },
      },
    });
    return;
  }

  if (action.modify) {
    ctx.state.modifiers.push({
      source: 0, // TODO fix
      player: player.id,
      modifier: action.modify,
      until: action.until,
    });
    return;
  }

  if (action.useVar) {
    ctx.state.next.unshift(
      {
        setPlayerVar: {
          name: action.useVar.name,
          value: player.id,
        },
      },
      {
        player: {
          target: player.id,
          action: action.useVar.action,
        },
      },
      {
        setPlayerVar: { name: action.useVar.name, value: undefined },
      }
    );
    return;
  }

  if (action.card) {
    ctx.state.next.unshift({
      card: {
        target: action.card.target,
        action: action.card.action,
      },
    });
    return;
  }

  throw new Error(`unknown player action: ${JSON.stringify(action)}`);
}
