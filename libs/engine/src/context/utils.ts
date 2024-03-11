import { CardId, PlayerId } from '@card-engine-nx/basic';
import { ViewContext } from './view';

export function cardIds(ctx: ViewContext) {
  return Object.keys(ctx.state.cards).map((id) => Number(id)) as CardId[];
}
export function getCard(id: CardId, ctx: ViewContext) {
  const state = ctx.state.cards[id];
  const view = ctx.view.cards[id];
  return { id, state, view };
}

export function getPlayer(id: PlayerId, ctx: ViewContext) {
  const state = ctx.state.players[id];
  const view = ctx.state.players[id]?.view;
  return { id, state, view };
}
