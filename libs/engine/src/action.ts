import { Action, PlayerDeck, Scenario } from '@card-engine-nx/state';
import { getTargetPlayer } from './player/target';
import { executePlayerAction } from './player/action';
import { reverse, shuffle } from 'lodash/fp';
import { values } from '@card-engine-nx/basic';
import { addPlayerCard, addGameCard, createPlayerState, single } from './utils';
import { sequence } from './utils/sequence';
import { uiEvent } from './eventFactories';
import { executeCardAction, getTargetCard } from './card';
import { calculateNumberExpr } from './expr';
import { ExecutionContext } from './context';
import { v4 as uuid } from 'uuid';

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
    throw new Error('not implemented');
  }

  if (action === 'dealShadowCards') {
    // TODO dealShadowCards
    return;
  }

  if (action === 'passFirstPlayerToken') {
    throw new Error('not implemented');
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
        { player: { target: 'each', action: { incrementThreat: diff } } },
        ...ctx.state.next,
      ];
    }
    return;
  }

  if (action === 'revealEncounterCard') {
    throw new Error('not implemented');
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
    const playerId = !ctx.state.players.A
      ? 'A'
      : !ctx.state.players.B
      ? 'B'
      : ctx.state.players.C
      ? 'D'
      : 'C';

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
    );

    if (card) {
      ctx.state.zones.encounterDeck.cards =
        ctx.state.zones.encounterDeck.cards.filter((id) => id !== card.id);
      ctx.state.zones.stagingArea.cards.push(card.id);
      card.sideUp = 'front';

      ctx.events.send(
        uiEvent.card_moved({
          cardId: card.id,
          source: {
            owner: 'game',
            type: 'encounterDeck',
          },
          destination: {
            owner: 'game',
            type: 'stagingArea',
          },
          side: 'front',
        })
      );
    } else {
      throw new Error(`card ${action.addToStagingArea} not found`);
    }
    return;
  }

  if (action.beginPhase) {
    ctx.state.phase = action.beginPhase;
    return;
  }

  if (action.playerActions) {
    ctx.state.choice = {
      id: uuid(),
      title: action.playerActions,
      dialog: false,
      multi: false,
      options: [],
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
