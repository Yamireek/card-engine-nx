import { State } from './state';
import { Action } from './types';

export function createState(program?: Action): State {
  return {
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
    effects: [],
    vars: {
      card: {},
      player: {},
    },
    actionLimits: [],
  };
}
