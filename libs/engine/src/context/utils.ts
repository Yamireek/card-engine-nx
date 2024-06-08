import { reverse } from 'lodash/fp';
import { CardId, PlayerId, ZoneId } from '@card-engine-nx/basic';
import { CostModifier, PlayerAction, Scope } from '@card-engine-nx/state';
import { CardCtx } from './CardCtx';

export function getZoneType(zone: ZoneId) {
  if (typeof zone === 'string') {
    return zone;
  }

  return zone.type;
}

export function getPlayerFromScope(
  scopes: Scope[],
  name: string
): PlayerId[] | undefined {
  const reversed = reverse(scopes);
  const scope = reversed.find((s) => s.player && s.player[name]);
  return scope?.player?.[name];
}

export function getCardFromScope(
  scopes: Scope[],
  name: string
): CardId[] | undefined {
  const reversed = reverse(scopes);
  const scope = reversed.find((s) => s.card && s.card[name]);
  return scope?.card?.[name];
}

export function createPayCostAction(
  card: CardCtx,
  modifiers: CostModifier
): PlayerAction | undefined {
  const zone = card.zone.type;

  if (zone !== 'hand' || !card.state.controller) {
    return undefined;
  }

  const sphere = card.props.sphere;
  const amount = card.props.cost;

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
