import {
  Action,
  CardDefinition,
  CardState,
  PlayerDeck,
  Scenario,
  State,
  View,
} from '@card-engine-nx/state';
import { getTargetPlayer } from './player/target';
import { executePlayerAction } from './player/action';
import { UIEvents } from './uiEvents';
import { getZoneState } from './zone/target';
import { shuffle } from 'lodash';
import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
} from '@card-engine-nx/basic';

export function executeAction(
  action: Action,
  state: State,
  view: View,
  events: UIEvents
) {
  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleEncounterDeck') {
    const zone = state.zones.encounterDeck;
    zone.cards = shuffle(zone.cards);
    return;
  }

  if (action.player) {
    const ids = getTargetPlayer(action.player.target, state);
    for (const id of ids) {
      const player = state.players[id];
      if (player) {
        executePlayerAction(action.player.action, player, state, view, events);
      } else {
        throw new Error('player not found');
      }
    }
    return;
  }

  if (action.sequence) {
    state.next = [...action.sequence, ...state.next];
    return;
  }

  if (action.addPlayer) {
    const playerId = !state.players.A
      ? 'A'
      : !state.players.B
      ? 'B'
      : state.players.C
      ? 'C'
      : 'D';

    state.players[playerId] = {
      id: playerId,
      thread: 0,
      zones: {
        hand: { cards: [], stack: false },
        library: { cards: [], stack: true },
        playerArea: { cards: [], stack: false },
        discardPile: { cards: [], stack: true },
        engaged: { cards: [], stack: false },
      },
      limitUses: { game: {} },
      flags: {},
    };

    for (const hero of action.addPlayer.heroes) {
      addPlayerCard(state, hero, playerId, 'front', 'playerArea');
    }

    for (const card of action.addPlayer.library) {
      addPlayerCard(state, card, playerId, 'back', 'library');
    }

    return;
  }

  if (action.setupScenario) {
    for (const encounterCard of action.setupScenario.encounterCards) {
      addGameCard(state, encounterCard, 'back', 'encounterDeck');
    }

    for (const questCard of action.setupScenario.questCards) {
      addGameCard(state, questCard, 'back', 'questDeck');
    }
  }

  throw new Error(`unknown  action: ${JSON.stringify(action)}`);
}

function addPlayerCard(
  state: State,
  definition: CardDefinition,
  owner: PlayerId,
  side: Side,
  zone: PlayerZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, owner);
  state.players[owner]?.zones[zone].cards.push(id);
  state.nextId++;
}

function addGameCard(
  state: State,
  definition: CardDefinition,
  side: Side,
  zone: GameZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, 'game');
  state.zones[zone].cards.push(id);
  state.nextId++;
}

function createCardState(
  id: CardId,
  side: Side,
  definition: CardDefinition,
  owner: PlayerId | 'game'
): CardState {
  return {
    id,
    token: {
      damage: 0,
      progress: 0,
      resources: 0,
    },
    mark: {
      questing: false,
      attacking: false,
      defending: false,
      attacked: false,
    },
    sideUp: side,
    tapped: false,
    definition: definition,
    attachments: [],
    owner: owner,
    controller: owner,
    limitUses: {
      phase: {},
      round: {},
    },
    modifiers: [],
  };
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
