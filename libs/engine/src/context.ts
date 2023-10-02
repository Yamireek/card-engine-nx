import { State, View } from '@card-engine-nx/state';
import { UIEvents } from './uiEvents';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Random } from './utils/random';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  card: Record<string, CardId>;
  player: Record<string, PlayerId>;
  random: Random;
};

export type ViewContext = {
  state: State;
  view: View;
  card: Record<string, CardId | undefined>;
  player: Record<string, PlayerId | undefined>;
};

export function cardIds(ctx: ViewContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}
