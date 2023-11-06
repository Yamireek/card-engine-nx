import { CardTarget } from '../card/target';
import { PlayerTarget } from '../player/target';

export type ScopeAction =
  | ScopeAction[]
  | { var: string; card: CardTarget }
  | { var: string; player: PlayerTarget }
  | { event: Event }
  | { x: number };
