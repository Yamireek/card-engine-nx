import { Scope, State, View } from '@card-engine-nx/state';
import { UIEvents } from './uiEvents';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Random } from './utils/random';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  scopes: Scope[];
  card: Record<string, CardId>;
  random: Random;
};

export type ViewContext = {
  state: State;
  view: View;
  scopes: Scope[];
  card: Record<string, CardId | undefined>;
};

export function cardIds(ctx: ViewContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}
