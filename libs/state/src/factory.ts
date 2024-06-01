import { GameZoneType, PlayerId, PlayerZoneType } from '@card-engine-nx/basic';
import { Action } from './action';
import { createPlayerState } from './player/factory';
import { SimpleCardState, SimpleState } from './simple';
import { State } from './state';
import { ZoneState } from './zone/state';

export function createState(initState?: SimpleState, program?: Action): State {
  const state: State = {
    round: 1,
    phase: 'setup',
    players: {},
    firstPlayer: '0',
    zones: {
      activeLocation: { cards: [] },
      discardPile: { cards: [] },
      encounterDeck: { cards: [] },
      questDeck: { cards: [] },
      questArea: { cards: [] },
      stagingArea: { cards: [] },
      victoryDisplay: { cards: [] },
      removed: { cards: [] },
    },
    next: program ? [program] : [],
    triggers: { end_of_phase: [], end_of_round: [] },
    nextId: 1,
    cards: {},
    actionLimits: [],
    modifiers: [],
    event: [],
    stack: [],
    scopes: [],
    surge: 0,
  };

  if (initState) {
    for (const playerKey of Object.keys(initState.players) as PlayerId[]) {
      const player = createPlayerState(playerKey);
      state.players[playerKey] = player;
      for (const zoneKey of Object.keys(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        initState.players[playerKey]!
      ) as PlayerZoneType[]) {
        const zone: ZoneState = { cards: [] };
        player.zones[zoneKey] = zone;
        const zoneInit = initState.players?.[playerKey]?.[zoneKey];
        if (zoneInit) {
          for (const definition of zoneInit) {
            state.next.push(addCard(definition, player.id, zoneKey));
          }
        }
      }
    }

    for (const key of Object.keys(initState)) {
      if (key === 'players') {
        continue;
      }

      const zoneKey = key as GameZoneType;

      const zone: ZoneState = { cards: [] };
      state.zones[zoneKey] = zone;
      const zoneInit = initState[zoneKey];
      if (zoneInit) {
        for (const definition of zoneInit) {
          state.next.push(addCard(definition, undefined, zoneKey));
        }
      }
    }
  }

  return state;
}

function addCard(
  definition: SimpleCardState,
  player: PlayerId | undefined,
  zoneType: GameZoneType | PlayerZoneType // TODO remove
): Action {
  const side =
    zoneType === 'library' || zoneType === 'encounterDeck' ? 'back' : 'front';

  if ('card' in definition) {
    const action: Action = {
      addCard: {
        definition: definition.card,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        zone: player ? { player, type: zoneType } : (zoneType as any),
        side: definition.side ?? side,
        damage: definition.damage,
        progress: definition.progress,
        resources: definition.resources,
        exhausted: definition.exhausted,
        attachments: definition.attachments,
      },
    };

    return action;
  } else {
    return {
      addCard: {
        definition,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        zone: player ? { player, type: zoneType } : (zoneType as any),
        side,
      },
    };
  }
}
