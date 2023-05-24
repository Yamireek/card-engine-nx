import { CardDefinition, State } from '@card-engine-nx/state';
import {
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
} from '@card-engine-nx/basic';

export function addPlayer() {
  return {
    print: () => 'addPlayer()',
    execute: (state: State) => {
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
    },
    result: () => 'full',
  };
}

export type Zone =
  | {
      owner: 'game';
      type: GameZoneType;
    }
  | { owner: PlayerId; type: PlayerZoneType };

export function addCard(definition: CardDefinition, side: Side, zone: Zone) {
  return {
    print: () => 'addCard()',
    execute: (state: State) => {
      const id = state.nextId;
      state.cards[id] = {
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
        owner: zone.owner,
        controller: zone.owner,
        limitUses: {
          phase: {},
          round: {},
        },
        modifiers: [],
      };
      state.nextId++;

      getZone(zone, state).cards.push(id);
      return id;
    },
    result: () => 'full',
  };
}

export function getZone(zone: Zone, state: State) {
  if (zone.owner === 'game') {
    return state.zones[zone.type];
  } else {
    const player = state.players[zone.owner];
    if (player) {
      return player.zones[zone.type];
    } else {
      throw new Error('Player not found');
    }
  }
}
