import { State, View } from '@card-engine-nx/state';
import { UIEvents } from './uiEvents';
import { CardId } from '@card-engine-nx/basic';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  card: Record<string, CardId>;
};

export function cardIds(ctx: ExecutionContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}
