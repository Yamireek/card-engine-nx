import { GameZoneType, PlayerId, PlayerZoneType } from '@card-engine-nx/basic';
import { State } from './state';
import { SimpleCardState, SimpleState } from './simple';
import { Action } from './action';
import { ZoneState } from './zone/state';
import { createCardState } from './card/factory';
import { createPlayerState } from './player/factory';

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
            addCard(state, zone, zoneKey, player.id, definition);
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
          addCard(state, zone, zoneKey, undefined, definition);
        }
      }
    }
  }

  return state;
}

function addCard(
  state: State,
  zone: ZoneState,
  zoneType: GameZoneType | PlayerZoneType,
  player: PlayerId | undefined,
  definition: SimpleCardState
) {
  const card = createCardState(
    state.nextId++,
    zoneType === 'library' || zoneType === 'encounterDeck' ? 'back' : 'front',
    'card' in definition ? definition.card : definition,
    player,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    player ? { player, type: zoneType } : (zoneType as any)
  );

  zone.cards.push(card.id);
  state.cards[card.id] = card;

  if ('card' in definition) {
    card.token.resources = definition.resources ?? 0;
    card.token.damage = definition.damage ?? 0;
    card.token.progress = definition.progress ?? 0;
    card.tapped = definition.exhausted ?? false;
    card.sideUp = definition.side ?? 'front';
    if (definition.attachments) {
      for (const a of definition.attachments) {
        const attachment = createCardState(
          state.nextId++,
          'front',
          a,
          player,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          player ? { player, type: zoneType } : (zoneType as any)
        );

        zone.cards.push(attachment.id);
        state.cards[attachment.id] = attachment;
        card.attachments.push(attachment.id);
      }
    }
  }
}
