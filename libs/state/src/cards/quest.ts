import { CardDefinition } from '../card';
import { Ability } from '../types';

export type QuestDefinition =
  | {
      sequence: number;
      name?: never;
      a: { name: string; abilities?: Ability[] };
      b: { name: string; questPoints: number; abilities?: Ability[] };
    }
  | {
      sequence: number;
      name: string;
      a: { name?: never; abilities?: Ability[] };
      b: { name?: never; questPoints: number; abilities?: Ability[] };
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
      traits: [],
      sphere: [],
    },
    back: {
      name: nameB,
      sequence: def.sequence,
      type: 'quest',
      questPoints: def.b.questPoints,
      abilities: def.b.abilities ?? [],
      traits: [],
      sphere: [],
    },
    orientation: 'landscape',
  };
}
