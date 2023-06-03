import { State } from './state';
import { Action } from './types';

export function createState(program?: Action): State {
  return {
    round: 1,
    phase: 'setup',
    players: {},
    firstPlayer: 'A',
    zones: {
      activeLocation: { cards: [], stack: false },
      discardPile: { cards: [], stack: true },
      encounterDeck: { cards: [], stack: true },
      questDeck: { cards: [], stack: true },
      stagingArea: { cards: [], stack: false },
      victoryDisplay: { cards: [], stack: true },
    },
    next: program ? [program] : [],
    triggers: { end_of_phase: [], end_of_round: [] },
    nextId: 1,
    cards: {},
    effects: [],
    vars: {
      card: {},
    },
  };
}
