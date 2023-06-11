import { State, View } from '@card-engine-nx/state';
import { UIEvents } from './uiEvents';
import { CardId, PlayerId } from '@card-engine-nx/basic';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  card: Record<string, CardId>;
  player: Record<string, PlayerId>;
  shuffle: <T>(items: T[]) => T[];
};

export type ViewContext = {
  state: State;
  view: View;
  card: Record<string, CardId>;
  player: Record<string, PlayerId>;
};

export function cardIds(ctx: ViewContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}
