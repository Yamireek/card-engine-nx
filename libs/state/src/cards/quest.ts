import { CardDefinition } from '../card';
import { Ability } from '../types';

export type QuestDefinition =
  | {
      sequence: number;
      name?: never;
      a: { name: string };
      b: { name: string; questPoints: number };
    }
  | {
      sequence: number;
      name: string;
      a: { name?: never };
      b: { name?: never; questPoints: number };
    };

export function quest(
  def: QuestDefinition,
  ...abilities: Ability[]
): CardDefinition {
  const nameA = def.name ?? def.a.name;
  const nameB = def.name ?? def.b.name;

  return {
    front: {
      name: nameA,
      sequence: def.sequence,
      type: 'quest',
      abilities,
    },
    back: {
      name: nameB,
      sequence: def.sequence,
      type: 'quest',
      questPoints: def.b.questPoints,
      abilities: [],
    },
    orientation: 'landscape',
  };
}
