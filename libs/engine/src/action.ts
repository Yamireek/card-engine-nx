import {
  Action,
  PlayerDeck,
  PlayerState,
  Scenario,
  State,
  View,
} from '@card-engine-nx/state';
import { getTargetPlayer } from './player/target';
import { executePlayerAction } from './player/action';
import { UIEvents } from './uiEvents';
import { reverse, shuffle } from 'lodash/fp';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { addPlayerCard, addGameCard, createPlayerState } from './utils';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  card: Record<string, CardId>;
};

export function executeAction(action: Action, ctx: ExecutionContext) {
  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleEncounterDeck') {
    const zone = ctx.state.zones.encounterDeck;
    zone.cards = shuffle(zone.cards);
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
  }

  throw new Error(`unknown  action: ${JSON.stringify(action)}`);
}

export function beginScenario(
  scenario: Scenario,
  ...decks: PlayerDeck[]
): Action {
  return {
    sequence: [
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
      //   flip('face', topCard(gameZone('questDeck'))),
      //   'SetupActions',
      //   flip('back', topCard(gameZone('questDeck'))),
      //   startGame()
    ],
  };
}
