import {
  CardGlobalModifier,
  PlayerGlobalModifier,
  Scope,
  State,
} from '@card-engine-nx/state';
import { values } from 'lodash';
import { createModifiers } from './card/modifier/create';
import { applyModifier } from './card/modifier/apply';
import { applyPlayerModifier } from './player/modifier/apply';
import { getTargetPlayers } from './player/target/multi';
import { calculateBoolExpr } from './expression/bool/calculate';
import { ViewContext } from './context/view';
import { getZoneType } from './zone/utils';
import { getTargetCards } from './card/target/multi';
import { asArray } from '@card-engine-nx/basic';

export function createBaseModifiers(state: State) {
  return values(state.cards).flatMap((c) => {
    if (c.sideUp === 'shadow') {
      return [];
    }

    const abilities = c.definition[c.sideUp].abilities;
    return abilities
      .flatMap((a) =>
        createModifiers(
          c.id,
          c.controller,
          a,
          state.phase,
          getZoneType(c.zone),
          c.definition.front.type,
          c.definition.front.name ?? ''
        )
      )
      .flatMap((modifier) => ({ applied: false, modifier }));
  });
}

export function applyGlobalPlayerModifier(
  state: State,
  modifier: PlayerGlobalModifier
) {
  const ctx: ViewContext = {
    state,
  };

  const scopes: Scope[] = [{ card: { self: asArray(modifier.source) } }];

  const condition = modifier.condition
    ? calculateBoolExpr(modifier.condition, ctx, scopes)
    : true;

  if (condition) {
    const targets = getTargetPlayers(modifier.player, ctx, scopes);

    for (const target of targets) {
      const player = state.players[target];
      if (player) {
        applyPlayerModifier(player.view, modifier.modifier);
      }
    }
  }
}

export function applyGlobalCardModifier(
  state: State,
  modifier: CardGlobalModifier
) {
  const sourceCard = state.cards[modifier.source];

  const targets = getTargetCards(
    modifier.card,
    {
      state,
    },
    [
      { player: { controller: asArray(sourceCard.controller) } },
      { card: { self: asArray(modifier.source) } },
    ]
  );

  for (const target of targets) {
    const ctx: ViewContext = {
      state,
    };

    const scopes: Scope[] = [
      {
        card: {
          target: asArray(target),
          self: asArray(modifier.source),
        },
      },
    ];

    const condition = modifier.condition
      ? calculateBoolExpr(modifier.condition, ctx, scopes)
      : true;
    if (condition) {
      applyModifier(
        modifier.modifier,
        state.cards[target].view,
        modifier.source,
        ctx,
        scopes
      );
    }
  }
}
