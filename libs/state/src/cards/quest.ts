import { CardDefinition } from '../card';
import { Modifier } from '../types';

export type QuestDefinition =
  | {
      sequence: number;
      name?: never;
      a: { name: string; abilities?: Modifier[] };
      b: { name: string; questPoints: number; abilities?: Modifier[] };
    }
  | {
      sequence: number;
      name: string;
      a: { name?: never; abilities?: Modifier[] };
      b: { name?: never; questPoints: number; abilities?: Modifier[] };
    };

export function quest(def: QuestDefinition): CardDefinition {
  const nameA = def.name ?? def.a.name;
  const nameB = def.name ?? def.b.name;

  return {
    front: {
      name: nameA,
      sequence: def.sequence,
      type: 'quest',
      abilities: def.a.abilities ?? [],
    },
    back: {
      name: nameB,
      sequence: def.sequence,
      type: 'quest',
      questPoints: def.b.questPoints,
      abilities: def.b.abilities ?? [],
    },
    orientation: 'landscape',
  };
}
