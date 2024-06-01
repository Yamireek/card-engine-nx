import { CardId } from '@card-engine-nx/basic';
import { CostModifier, PlayerAction } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { getZoneType } from '../../zone/utils';

export function createPayCostAction(
  cardId: CardId,
  modifiers: CostModifier,
  ctx: ViewContext
): PlayerAction | undefined {
  const view = ctx.view.cards[cardId];
  const state = ctx.state.cards[cardId];
  const zone = getZoneType(state.zone);

  if (zone !== 'hand' || !state.controller) {
    return undefined;
  }

  const sphere = view.props.sphere;
  const amount = view.props.cost;

  if (!sphere || typeof amount !== 'number') {
    return undefined;
  }

  return {
    payResources: {
      amount,
      sphere,
      ...modifiers,
    },
  };
}
