import { NumberExpr } from '../../expression/number';

export type PropertyIncrement = Partial<
  Record<
    'attack' | 'defense' | 'willpower' | 'hitPoints' | 'threat',
    NumberExpr
  >
>;
