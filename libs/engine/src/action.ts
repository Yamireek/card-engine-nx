import {
  Action,
  CardTarget,
  PlayerDeck,
  Scenario,
} from '@card-engine-nx/state';
import { getTargetPlayer } from './player/target';
import { executePlayerAction } from './player/action';
import { reverse, shuffle } from 'lodash/fp';
import { values } from '@card-engine-nx/basic';
import { addPlayerCard, addGameCard, createPlayerState, single } from './utils';
import { sequence } from './utils/sequence';
import { executeCardAction, getTargetCard } from './card';
import { calculateBoolExpr, calculateNumberExpr } from './expr';
import { ExecutionContext } from './context';
import { sum } from 'lodash';

export function executeAction(action: Action, ctx: ExecutionContext) {
  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleEncounterDeck') {
    const zone = ctx.state.zones.encounterDeck;
    zone.cards = shuffle(zone.cards);
    return;
  }

  if (action === 'executeSetupActions') {
    const actions = values(ctx.view.cards).flatMap((c) => c.setup);
    if (actions.length > 0) {
      ctx.state.next = [...actions, ...ctx.state.next];
    }
    return;
  }

  if (action === 'endRound') {
    ctx.state.next = [gameRound()];
    return;
  }

  if (action === 'endPhase') {
    return;
  }

  if (action === 'chooseTravelDestination') {
    const target: CardTarget = {
      and: [
        { zone: { owner: 'game', type: 'stagingArea' } },
        { type: ['location'] },
      ],
    };

    const locations = getTargetCard(target, ctx);
    if (locations.length > 0) {
      ctx.state.next.unshift({
        player: {
          target: 'first',
          action: {
            chooseCardActions: {
              title: 'Choose location for travel',
              multi: false,
              optional: true,
              target,
              action: 'travel',
            },
          },
        },
      });
    }
    return;
  }

  if (action === 'dealShadowCards') {
    // TODO dealShadowCards
    return;
  }

  if (action === 'passFirstPlayerToken') {
    // TODO passFirstPlayerToken
    return;
  }

  if (action === 'resolveQuesting') {
    const totalWillpower = calculateNumberExpr(
      {
        fromCard: {
          card: { mark: 'questing' },
          value: 'willpower',
          sum: true,
        },
      },
      ctx
    );

    const totalThreat = calculateNumberExpr(
      {
        fromCard: {
          card: { zone: { owner: 'game', type: 'stagingArea' } },
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
    // TODO treatchery move to discard pile
    ctx.state.next.unshift({
      card: {
        taget: { top: { game: 'encounterDeck' } },
        action: {
          move: {
            from: {
              owner: 'game',
              type: 'encounterDeck',
            },
            to: {
              owner: 'game',
              type: 'stagingArea',
            },
            side: 'front',
          },
        },
      },
    });
    return;
  }

  if (action.player) {
    const ids = getTargetPlayer(action.player.target, ctx.state);
    for (const id of ids) {
      const player = ctx.state.players[id];
      if (player) {
        executePlayerAction(action.player.action, player, ctx);
      } else {
        throw new Error('player not found');
      }
    }
    return;
  }

  if (action.card) {
    const ids = getTargetCard(action.card.taget, ctx);
    for (const id of ids) {
      const card = ctx.state.cards[id];
      if (card) {
        executeCardAction(action.card.action, card, ctx);
      } else {
        throw new Error('card not found');
      }
    }
    return;
  }

  if (action.sequence) {
    ctx.state.next = [...action.sequence, ...ctx.state.next];
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

  if (action.loadDeck) {
    // TODO not used
    for (const hero of action.loadDeck.deck.heroes) {
      addPlayerCard(
        ctx.state,
        hero,
        action.loadDeck.player,
        'front',
        'playerArea'
      );
    }

    for (const card of action.loadDeck.deck.library) {
      addPlayerCard(ctx.state, card, action.loadDeck.player, 'back', 'library');
    }
    return;
  }

  if (action.setupScenario) {
    for (const encounterCard of action.setupScenario.encounterCards) {
      addGameCard(ctx.state, encounterCard, 'back', 'encounterDeck');
    }

    for (const questCard of reverse(action.setupScenario.questCards)) {
      addGameCard(ctx.state, questCard, 'front', 'questDeck');
    }
    return;
  }

  if (action.addToStagingArea) {
    const card = values(ctx.state.cards).find(
      (c) => c.definition.front.name === action.addToStagingArea
    ); // TODO filter

    if (card) {
      ctx.state.next.unshift({
        card: {
          taget: card.id,
          action: {
            move: {
              from: {
                owner: 'game',
                type: 'encounterDeck',
              },
              to: {
                owner: 'game',
                type: 'stagingArea',
              },
              side: 'front',
            },
          },
        },
      });
    }

    return;
  }

  if (action.beginPhase) {
    ctx.state.phase = action.beginPhase;
    return;
  }

  if (action.playerActions) {
    ctx.state.choice = {
      id: ctx.state.nextId++,
      title: action.playerActions,
      dialog: false,
      multi: false,
      options: [],
      optional: true,
    };
    return;
  }

  if (action.playAlly) {
    const cardId = single(getTargetCard(action.playAlly, ctx));
    const card = ctx.view.cards[cardId];
    const owner = ctx.state.cards[cardId].owner;

    if (card.props.cost && card.props.sphere && owner !== 'game') {
      ctx.state.next = [
        {
          player: {
            target: owner,
            action: {
              payResources: {
                amount: card.props.cost,
                sphere: card.props.sphere,
              },
            },
          },
        },
        {
          card: {
            taget: cardId,
            action: {
              move: {
                from: { owner, type: 'hand' },
                to: { owner, type: 'playerArea' },
                side: 'front',
              },
            },
          },
        },
        ...ctx.state.next,
      ];
    }
    return;
  }

  if (action.setCardVar) {
    ctx.state.vars.card[action.setCardVar.name] = action.setCardVar.value;
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

  if (action.placeProgress) {
    ctx.state.next = [
      {
        card: {
          taget: { top: { game: 'questArea' } },
          action: { placeProgress: action.placeProgress },
        },
      },
      ...ctx.state.next,
    ];
    return;
  }

  if (action.while) {
    const condition = calculateBoolExpr(action.while.condition, ctx);
    if (condition) {
      ctx.state.next.unshift(action.while.action, action);
    }
    return;
  }

  throw new Error(`unknown  action: ${JSON.stringify(action)}`);
}

export function beginScenario(
  scenario: Scenario,
  ...decks: PlayerDeck[]
): Action {
  return sequence(
    {
      setupScenario: scenario,
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
        taget: { top: { game: 'questDeck' } },
        action: {
          move: {
            from: { owner: 'game', type: 'questDeck' },
            to: { owner: 'game', type: 'questArea' },
            side: 'front',
          },
        },
      },
    },
    'executeSetupActions',
    {
      card: {
        action: {
          flip: 'back',
        },
        taget: {
          zone: {
            owner: 'game',
            type: 'questArea',
          },
        },
      },
    },
    gameRound()
  );
}

export const phaseResource = sequence(
  { beginPhase: 'resource' },
  { player: { target: 'each', action: { draw: 1 } } },
  {
    card: {
      taget: { and: ['inAPlay', { type: ['hero'] }] },
      action: { generateResources: 1 },
    },
  },
  { playerActions: 'End resource phase' },
  'endPhase'
);

export const phasePlanning = sequence(
  { beginPhase: 'planning' },
  { playerActions: 'End planning phase' },
  'endPhase'
);

export const phaseQuest = sequence(
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
  'endPhase'
);

export const phaseTravel = sequence(
  { beginPhase: 'travel' },
  'chooseTravelDestination',
  { playerActions: 'End travel phase' },
  'endPhase'
);

export const phaseEncounter = sequence(
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
  'endPhase'
);

export const phaseCombat = sequence(
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
  'endPhase'
);

export const phaseRefresh: Action = sequence(
  { beginPhase: 'refresh' },
  { card: { taget: 'each', action: 'ready' } },
  { player: { target: 'each', action: { incrementThreat: 1 } } },
  'passFirstPlayerToken',
  { playerActions: 'End refresh phase and round' },
  'endPhase'
);

export function gameRound(): Action {
  return sequence(
    phaseResource,
    phasePlanning,
    phaseQuest,
    phaseTravel,
    phaseEncounter,
    phaseCombat,
    phaseRefresh,
    'endRound'
  );
}
