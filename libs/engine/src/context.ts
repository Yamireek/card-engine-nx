import { Scope, State, View } from '@card-engine-nx/state';
import { UIEvents } from './uiEvents';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import { Random } from './utils/random';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  random: Random;
  scopes: Scope[];
};

export type ViewContext = {
  state: State;
  view: View;
  scopes: Scope[];
};

export function cardIds(ctx: ViewContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}
