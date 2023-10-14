import {
  Action,
  CardTarget,
  Choice,
  Difficulty,
  PlayerAction,
  PlayerDeck,
  Scenario,
  createPlayerState,
} from '@card-engine-nx/state';
import { getTargetPlayer, getTargetPlayers } from './player/target';
import { executePlayerAction } from './player/action';
import { isArray, keys, last, reverse, sum } from 'lodash/fp';
import { values } from '@card-engine-nx/basic';
import { addPlayerCard, addGameCard } from './utils';
import { executeCardAction, getTargetCard, getTargetCards } from './card';
import { calculateBoolExpr, calculateNumberExpr } from './expr';
import { ExecutionContext } from './context';
import { canExecute } from './resolution';
import { getZoneState } from './zone/target';

export function executeAction(action: Action, ctx: ExecutionContext) {
  if (isArray(action)) {
    ctx.state.next.unshift(...action);
    return;
  }

  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleEncounterDeck') {
    const zone = ctx.state.zones.encounterDeck;
    zone.cards = ctx.random.shuffle(zone.cards);
    return;
  }

  if (action === 'setup') {
    ctx.state.next.unshift();
    ctx.state.next.unshift(
      {
        choice: {
          id: ctx.state.nextId++,
          title: 'Setup',
          type: 'show',
          cardId: ctx.state.zones.questArea.cards[0] ?? 0,
        },
      },
      ...ctx.view.setup,
      {
        card: {
          action: {
            flip: 'back',
          },
          target: {
            zone: 'questArea',
          },
        },
      },
      {
        choice: {
          id: ctx.state.nextId++,
          title: 'Setup',
          type: 'show',
          cardId: ctx.state.zones.questArea.cards[0] ?? 0,
        },
      }
    );
    return;
  }

  if (action === 'endRound') {
    ctx.state.actionLimits = ctx.state.actionLimits.filter(
      (l) => l.type !== 'round'
    );

    for (const player of values(ctx.state.players)) {
      for (const limit of keys(player.limits)) {
        if (player.limits[limit].type === 'round') {
          delete player.limits[limit];
        }
      }
    }

    ctx.state.modifiers = ctx.state.modifiers.filter(
      (m) => m.until !== 'end_of_round'
    );

    ctx.state.next.unshift({ event: { type: 'end_of_round' } }, gameRound());
    ctx.state.triggers.end_of_round = [];
    ctx.state.round++;
    return;
  }

  if (action === 'endPhase') {
    ctx.state.actionLimits = ctx.state.actionLimits.filter(
      (l) => l.type !== 'phase'
    );

    for (const player of values(ctx.state.players)) {
      for (const limit of keys(player.limits)) {
        if (player.limits[limit].type === 'phase') {
          delete player.limits[limit];
        }
      }
    }

    ctx.state.modifiers = ctx.state.modifiers.filter(
      (m) => m.until !== 'end_of_phase'
    );

    ctx.state.next.unshift(...ctx.state.triggers.end_of_phase);
    ctx.state.triggers.end_of_phase = [];
    return;
  }

  if (action === 'chooseTravelDestination') {
    const existing = getTargetCards({ zoneType: 'activeLocation' }, ctx);
    if (existing.length > 0) {
      return;
    }

    ctx.state.next.unshift({
      player: {
        target: 'first',
        action: {
          chooseCardActions: {
            title: 'Choose location for travel',
            target: {
              zone: 'stagingArea',
              type: 'location',
            },
            action: 'travel',
            optional: true,
          },
        },
      },
    });
    return;
  }

  if (action === 'dealShadowCards') {
    const enemies = getTargetCards({ type: 'enemy', zoneType: 'engaged' }, ctx);
    for (const enemy of enemies) {
      const deck = ctx.state.zones.encounterDeck;
      const shadow = deck.cards.pop();
      if (shadow) {
        const targetZone = getZoneState(ctx.state.cards[enemy].zone, ctx.state);
        ctx.state.cards[enemy].shadow.push(shadow);
        ctx.state.cards[shadow].zone = ctx.state.cards[enemy].zone;
        ctx.state.cards[shadow].sideUp = 'shadow';
        deck.cards.pop();
        targetZone.cards.push(shadow);
      }
    }
    return;
  }

  if (action === 'passFirstPlayerToken') {
    const next = getTargetPlayer('next', ctx);
    ctx.state.firstPlayer = next;
    return;
  }

  if (action === 'resolveQuesting') {
    const totalWillpower = calculateNumberExpr(
      {
        card: {
          target: { mark: 'questing' },
          value: 'willpower',
          sum: true,
        },
      },
      ctx
    );

    const totalThreat = calculateNumberExpr(
      {
        card: {
          target: { zone: 'stagingArea' },
          value: 'threat',
          sum: true,
        },
      },
      ctx
    );

    const diff = totalWillpower - totalThreat;
    if (diff > 0) {
      ctx.state.next = [{ placeProgress: diff }, ...ctx.state.next];
    }
    if (diff < 0) {
      ctx.state.next = [
        { player: { target: 'each', action: { incrementThreat: -diff } } },
        ...ctx.state.next,
      ];
    }
    return;
  }

  if (action === 'revealEncounterCard') {
    const card = getTargetCard({ top: 'encounterDeck' }, ctx);

    if (!card) {
      // TODO reshuffle encounter deck
      return;
    }

    ctx.state.next.unshift({
      card: {
        target: card,
        action: 'reveal',
      },
    });

    return;
  }

  if (action === 'win') {
    const playerScores = values(ctx.state.players).map((p) => {
      const threat = p.thread;
      const deadHeroes = getTargetCards(
        {
          zone: { player: p.id, type: 'discardPile' },
          type: 'hero',
        },
        ctx
      ).map((id) => ctx.state.cards[id]);

      const aliveHeroes = getTargetCards(
        {
          zone: { player: p.id, type: 'discardPile' },
          type: 'hero',
        },
        ctx
      ).map((id) => ctx.state.cards[id]);

      return (
        threat +
        sum(deadHeroes.map((h) => h.definition.front.threatCost)) +
        sum(aliveHeroes.map((h) => h.token.damage))
      );
    });

    const victoryCards = getTargetCards(
      {
        zoneType: 'victoryDisplay',
      },
      ctx
    ).map((id) => ctx.view.cards[id]);

    const score =
      sum(playerScores) -
      sum(victoryCards.map((c) => c.props.victory)) +
      ctx.state.round * 10;

    ctx.state.result = {
      win: true,
      score,
    };
    return;
  }

  if (action === 'loose') {
    ctx.state.result = {
      win: false,
      score: 0,
    };
    return;
  }

  if (action === 'stackPop') {
    const effect = ctx.state.stack.pop();
    if (effect) {
      if (effect.whenRevealed && !effect.canceled) {
        ctx.state.next.unshift(effect.whenRevealed);
      }
    }
    return;
  }

  if (action === 'stateCheck') {
    const destroy = getTargetCards('destroyed', ctx);
    const explore = getTargetCards(
      { and: [{ type: 'location' }, 'explored'] },
      ctx
    );
    const advance = getTargetCards(
      { and: [{ type: 'quest' }, 'explored'] },
      ctx
    );

    if (destroy.length > 0 || explore.length > 0 || advance.length > 0) {
      ctx.state.next.unshift('stateCheck');
    }

    if (destroy.length > 0) {
      ctx.state.next.unshift({
        card: {
          target: destroy,
          action: 'destroy',
        },
      });
    }

    if (explore.length > 0) {
      ctx.state.next.unshift({
        card: {
          target: explore,
          action: 'explore',
        },
      });
    }

    if (advance.length > 0) {
      ctx.state.next.unshift({
        card: {
          target: advance,
          action: 'advance',
        },
      });
    }

    for (const player of values(ctx.state.players)) {
      const heroes = getTargetCards(
        { simple: 'inAPlay', type: 'hero', controller: player.id },
        ctx
      );
      if (heroes.length === 0) {
        ctx.state.next.unshift({ player: player.id, action: 'eliminate' });
        return;
      }
    }

    return;
  }

  if ('player' in action && 'action' in action) {
    return executeAction(
      { player: { target: action.player, action: action.action } },

      ctx
    );
  }

  if ('card' in action && 'action' in action) {
    return executeAction(
      { card: { target: action.card, action: action.action } },
      ctx
    );
  }

  if (action.stackPush) {
    ctx.state.stack.push(action.stackPush);
    return;
  }

  if (action.cancel) {
    const effect = last(ctx.state.stack);
    if (!effect) {
      throw new Error('no effect to cancel');
    }

    if (effect.whenRevealed) {
      effect.canceled = true;
    }
    return;
  }

  if (action.player) {
    const ids = getTargetPlayers(action.player.target, ctx);
    for (const id of ids) {
      const player = ctx.state.players[id];
      if (player) {
        const playerAction: PlayerAction = !ctx.state.vars.player.target
          ? { useVar: { name: 'target', action: action.player.action } }
          : action.player.action;
        executePlayerAction(playerAction, player, ctx);
      } else {
        throw new Error('player not found');
      }
    }
    return;
  }

  if (action.card) {
    const ids = getTargetCards(action.card.target, ctx);
    for (const id of ids) {
      const card = ctx.state.cards[id];
      if (card) {
        executeCardAction(action.card.action, card, {
          ...ctx,
          card: { ...ctx.card, target: id },
        });
      } else {
        throw new Error('card not found');
      }
    }
    return;
  }

  if (action.addPlayer) {
    const playerId = !ctx.state.players[0]
      ? '0'
      : !ctx.state.players[1]
      ? '1'
      : ctx.state.players[2]
      ? '3'
      : '2';

    ctx.state.players[playerId] = createPlayerState(playerId);

    for (const hero of action.addPlayer.heroes) {
      addPlayerCard(ctx.state, hero, playerId, 'front', 'playerArea');
    }

    for (const card of action.addPlayer.library) {
      addPlayerCard(ctx.state, card, playerId, 'back', 'library');
    }
    return;
  }

  if (action.setupScenario) {
    for (const set of action.setupScenario.scenario.sets) {
      for (const card of set.easy) {
        addGameCard(ctx.state, card, 'back', 'encounterDeck');
      }

      if (action.setupScenario.difficulty === 'normal') {
        for (const card of set.normal) {
          addGameCard(ctx.state, card, 'back', 'encounterDeck');
        }
      }
    }

    for (const questCard of reverse(action.setupScenario.scenario.quest)) {
      addGameCard(ctx.state, questCard, 'front', 'questDeck');
    }
    return;
  }

  if (action.beginPhase) {
    ctx.state.phase = action.beginPhase;
    return;
  }

  if (action.choice) {
    ctx.state.choice = action.choice as Choice;
    return;
  }

  if (action.playerActions) {
    ctx.state.next.unshift('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        title: action.playerActions,
        type: 'actions',
      },
    });
    return;
  }

  if (action.setCardVar) {
    ctx.state.vars.card[action.setCardVar.name] = action.setCardVar.value;
    return;
  }

  if (action.setPlayerVar) {
    ctx.state.vars.player[action.setPlayerVar.name] = action.setPlayerVar.value;
    return;
  }

  if (action.repeat) {
    const amount = calculateNumberExpr(action.repeat.amount, ctx);
    if (amount === 0) {
      return;
    } else {
      ctx.state.next = [
        action.repeat.action,
        {
          repeat: {
            amount: amount - 1,
            action: action.repeat.action,
          },
        },
        ...ctx.state.next,
      ];
    }
    return;
  }

  if (action.clearMarks) {
    for (const card of values(ctx.state.cards)) {
      card.mark[action.clearMarks] = false;
    }
    return;
  }

  if (action.placeProgress !== undefined) {
    if (action.placeProgress === 0) {
      return;
    }

    const activeLocation = getTargetCards({ top: 'activeLocation' }, ctx);

    if (activeLocation.length === 0) {
      ctx.state.next = [
        {
          card: {
            target: { top: 'questArea' },
            action: { placeProgress: action.placeProgress },
          },
        },
        ...ctx.state.next,
      ];
      return;
    }

    if (activeLocation.length === 1) {
      const id = activeLocation[0];
      const cardView = ctx.view.cards[id];
      const qp = cardView.props.questPoints;
      if (qp) {
        const cardState = ctx.state.cards[id];
        const remaining = qp - cardState.token.progress;
        const progressLocation = Math.min(action.placeProgress, remaining);
        const progressQuest = action.placeProgress - progressLocation;

        ctx.state.next.unshift(
          {
            card: {
              target: activeLocation,
              action: { placeProgress: progressLocation },
            },
          },
          {
            card: {
              target: { top: 'questArea' },
              action: { placeProgress: progressQuest },
            },
          }
        );
      }
    } else {
      throw new Error('multiple active locations');
    }
    return;
  }

  if (action.while) {
    const condition = calculateBoolExpr(action.while.condition, ctx);
    if (condition) {
      ctx.state.next.unshift(action.while.action, action);
    }
    return;
  }

  if (action.payment) {
    ctx.state.next.unshift(action.payment.cost, action.payment.effect);
    return;
  }

  if (action.useLimit) {
    const existing = ctx.state.actionLimits.find(
      (l) => l.card === action.useLimit?.card
    );

    if (!existing) {
      ctx.state.actionLimits.push({
        card: action.useLimit.card,
        amount: 1,
        type: action.useLimit.type,
      });
    } else {
      existing.amount += 1;
    }
    return;
  }

  if (action.event) {
    if (action.event === 'none') {
      ctx.state.event?.pop();
      return;
    }

    const event = action.event;

    if (!ctx.state.event) {
      ctx.state.event = [];
    }

    if (event.type === 'revealed') {
      ctx.state.choice = {
        id: ctx.state.nextId++,
        title: 'Revealed',
        type: 'show',
        cardId: event.card,
      };
    }

    ctx.state.event.push(action.event);

    ctx.state.next.unshift({ event: 'none' });

    const reponses = ctx.view.responses[event.type] ?? [];

    const forced = reponses
      .filter((r) => r.forced)
      .filter((r) => ('card' in event ? r.card === event.card : true))
      .filter(
        (r) =>
          !r.condition ||
          calculateBoolExpr(r.condition, {
            ...ctx,
            card: { ...ctx.card, target: r.card, self: r.source },
          })
      );

    const optional = reponses
      .filter((r) => !r.forced)
      .filter((r) => ('card' in event ? r.card === event.card : true))
      .filter(
        (r) =>
          !r.condition ||
          calculateBoolExpr(r.condition, {
            ...ctx,
            card: { ...ctx.card, target: r.card, self: r.source },
          })
      );

    if (optional.length > 0) {
      ctx.state.next.unshift({
        player: {
          target: 'first',
          action: {
            chooseActions: {
              title: 'Choose responses for event ' + event.type,
              actions: optional.map((r) => ({
                title: r.description,
                action: {
                  useCardVar: {
                    name: 'target',
                    value: r.card,
                    action: {
                      useCardVar: {
                        name: 'self',
                        value: r.source,
                        action: r.action,
                      },
                    },
                  },
                },
              })),
              optional: true,
              multi: true,
            },
          },
        },
      });
    }

    if (forced.length > 0) {
      ctx.state.next.unshift(
        ...forced.map((r) => ({
          useCardVar: {
            name: 'self',
            value: r.card,
            action: {
              useCardVar: {
                name: 'self',
                value: r.source,
                action: r.action,
              },
            },
          },
        }))
      );
    }

    if (action.event.type === 'revealed') {
      const card = ctx.view.cards[action.event.card];
      if (card.whenRevealed.length > 0) {
        const target = action.event.card;
        ctx.state.next.unshift(
          card.whenRevealed.map((effect) => ({
            card: {
              target,
              action: {
                whenRevealed: effect,
              },
            },
          }))
        );
      }
    }

    // TODO surge

    return;
  }

  if (action.resolveAttack) {
    const attacking = getTargetCards(action.resolveAttack.attackers, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const defender = getTargetCards(action.resolveAttack.defender, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const attack = sum(attacking.map((a) => a.props.attack || 0));
    const defense = sum(defender.map((d) => d.props.defense || 0));

    const damage = attack - defense;
    if (damage > 0) {
      if (defender.length === 1) {
        ctx.state.next.unshift({
          card: {
            target: defender.map((c) => c.id),
            action: {
              dealDamage: {
                amount: damage,
                attackers: attacking.map((a) => a.id),
              },
            },
          },
        });
      } else {
        throw new Error('unexpected defender count');
      }
    }
    return;
  }

  if (action.atEndOfPhase) {
    ctx.state.triggers.end_of_phase.push(action.atEndOfPhase);
    return;
  }

  if (action.useCardVar) {
    ctx.state.next.unshift(
      {
        setCardVar: {
          name: action.useCardVar.name,
          value: action.useCardVar.value,
        },
      },
      action.useCardVar.action,
      {
        setCardVar: { name: action.useCardVar.name, value: undefined },
      }
    );
    return;
  }

  if (action.usePlayerVar) {
    return ctx.state.next.unshift(
      {
        setPlayerVar: {
          name: action.usePlayerVar.name,
          value: action.usePlayerVar.value,
        },
      },
      action.usePlayerVar.action,
      {
        setPlayerVar: { name: action.usePlayerVar.name, value: undefined },
      }
    );
  }

  throw new Error(`unknown action: ${JSON.stringify(action)}`);
}

export function beginScenario(
  scenario: Scenario,
  difficulty: Difficulty,
  ...decks: PlayerDeck[]
): Action {
  return [
    {
      setupScenario: { scenario, difficulty },
    },
    ...decks.map((d) => ({ addPlayer: d })),
    'shuffleEncounterDeck',
    {
      player: {
        target: 'each',
        action: 'shuffleLibrary',
      },
    },
    {
      player: {
        target: 'each',
        action: {
          draw: 6,
        },
      },
    },
    {
      card: {
        target: { top: 'questDeck' },
        action: {
          move: {
            from: 'questDeck',
            to: 'questArea',
            side: 'front',
          },
        },
      },
    },
    'setup',
    gameRound(),
  ];
}

export const phaseResource: Action = [
  { beginPhase: 'resource' },
  { player: { target: 'each', action: { draw: 1 } } },
  {
    card: {
      target: { and: ['inAPlay', { type: 'hero' }] },
      action: { generateResources: 10 },
    },
  },
  { playerActions: 'End resource phase' },
  'endPhase',
];

export const phasePlanning: Action = [
  { beginPhase: 'planning' },
  { playerActions: 'End planning phase' },
  'endPhase',
];

export const phaseQuest: Action = [
  { beginPhase: 'quest' },
  {
    player: {
      target: 'each',
      action: 'commitCharactersToQuest',
    },
  },
  { playerActions: 'Staging' },
  { repeat: { amount: 'countOfPlayers', action: 'revealEncounterCard' } },
  { playerActions: 'Quest resolution' },
  'resolveQuesting',
  { playerActions: 'End phase' },
  { clearMarks: 'questing' },
  'endPhase',
];

export const phaseTravel: Action = [
  { beginPhase: 'travel' },
  'chooseTravelDestination',
  { playerActions: 'End travel phase' },
  'endPhase',
];

export const phaseEncounter: Action = [
  { beginPhase: 'encounter' },
  { player: { target: 'each', action: 'optionalEngagement' } },
  { playerActions: 'Engagement Checks' },
  {
    while: {
      condition: 'enemiesToEngage',
      action: { player: { target: 'each', action: 'engagementCheck' } },
    },
  },
  { playerActions: 'Next encounter phase' },
  'endPhase',
];

export const phaseCombat: Action = [
  { beginPhase: 'combat' },
  'dealShadowCards',
  { playerActions: 'Resolve enemy attacks' },
  {
    player: {
      target: 'each',
      action: 'resolveEnemyAttacks',
    },
  },
  { clearMarks: 'attacked' },
  { playerActions: 'Resolve player attacks' },
  {
    player: {
      target: 'each',
      action: 'resolvePlayerAttacks',
    },
  },
  { clearMarks: 'attacked' },
  { playerActions: 'End combat phase' },
  { card: { side: 'shadow' }, action: 'discard' },
  'endPhase',
];

export const phaseRefresh: Action = [
  { beginPhase: 'refresh' },
  { card: { target: 'exhausted', action: { ready: 'refresh' } } },
  { player: { target: 'each', action: { incrementThreat: 1 } } },
  'passFirstPlayerToken',
  { playerActions: 'End refresh phase and round' },
  'endPhase',
];

export function gameRound(): Action {
  return [
    phaseResource,
    phasePlanning,
    phaseQuest,
    phaseTravel,
    phaseEncounter,
    phaseCombat,
    phaseRefresh,
    'endRound',
  ];
}
