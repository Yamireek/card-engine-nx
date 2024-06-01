import { mapValues, values } from 'lodash';
import {
  CardGlobalModifier,
  PlayerGlobalModifier,
  State,
  View,
} from '@card-engine-nx/state';
import { createPlayAllyAction } from './card/action/play/ally';
import { createPlayAttachmentAction } from './card/action/play/attachment';
import { applyModifier } from './card/modifier/apply';
import { createModifiers } from './card/modifier/create';
import { getTargetCards } from './card/target/multi';
import { createCardView } from './card/view';
import { updatedScopes } from './context';
import { createViewContext } from './context/view';
import { calculateBoolExpr } from './expression/bool/calculate';
import { applyPlayerModifier } from './player/modifier/apply';
import { getTargetPlayers } from './player/target/multi';
import { createPlayerView } from './player/view';
import { getZoneType } from './zone/utils';

export function createBaseView(state: State): View {
  return {
    cards: mapValues(state.cards, (c) => createCardView(c)),
    players: mapValues(state.players, (p) =>
      p ? createPlayerView(p) : undefined
    ),
    actions: [],
    modifiers: [],
    responses: {},
  };
}

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

export function createView(state: State): View {
  const view = createBaseView(state);
  view.modifiers = createBaseModifiers(state);

  view.modifiers.push(
    ...state.modifiers.map((m) => ({ applied: false, modifier: m }))
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const modifier of view.modifiers.filter((m) => !m.applied)) {
      allApplied = false;

      if ('card' in modifier.modifier) {
        applyGlobalCardModifier(state, view, modifier.modifier);
      }

      if ('player' in modifier.modifier) {
        applyGlobalPlayerModifier(state, view, modifier.modifier);
      }

      modifier.applied = true;
    }

    if (allApplied) {
      break;
    }
  }

  if (state.phase === 'planning') {
    for (const player of values(state.players).filter((p) => !p.eliminated)) {
      for (const cardId of player.zones.hand.cards) {
        const card = view.cards[cardId];
        if (
          card.props.type === 'ally' &&
          card.props.sphere.length > 0 &&
          typeof card.props.cost === 'number'
        ) {
          view.actions.push({
            description: `Play ally ${card.props.name}`,
            card: cardId,
            action: createPlayAllyAction(
              card.props.sphere,
              card.props.cost,
              player.id,
              cardId
            ),
          });
        }

        if (
          card.props.type === 'attachment' &&
          card.props.sphere &&
          typeof card.props.cost === 'number' &&
          card.attachesTo
        ) {
          view.actions.push({
            description: 'Play attachment',
            card: cardId,
            action: createPlayAttachmentAction(
              card.props.sphere,
              card.props.cost,
              card.attachesTo,
              player.id,
              cardId
            ),
          });
        }
      }
    }
  }

  return view;
}

export function applyGlobalPlayerModifier(
  state: State,
  view: View,
  modifier: PlayerGlobalModifier
) {
  const ctx = createViewContext(state, view);

  const condition = modifier.condition
    ? calculateBoolExpr(
        modifier.condition,
        updatedScopes(ctx, {
          var: 'self',
          card: modifier.source,
        })
      )
    : true;

  if (condition) {
    const targets = getTargetPlayers(modifier.player, ctx);

    for (const target of targets) {
      const player = view.players[target];
      if (player) {
        applyPlayerModifier(player, modifier.modifier);
      }
    }
  }
}

export function applyGlobalCardModifier(
  state: State,
  view: View,
  modifier: CardGlobalModifier
) {
  const sourceCard = state.cards[modifier.source];
  const targets = getTargetCards(
    modifier.card,
    updatedScopes(createViewContext(state, view), [
      sourceCard.controller
        ? {
            var: 'controller',
            player: sourceCard.controller,
          }
        : [],
      {
        var: 'self',
        card: modifier.source,
      },
    ])
  );
  for (const target of targets) {
    const ctx = createViewContext(state, view);
    const condition = modifier.condition
      ? calculateBoolExpr(modifier.condition, ctx)
      : true;
    if (condition) {
      applyModifier(
        modifier.modifier,
        view.cards[target],
        modifier.source,
        updatedScopes(ctx, [
          {
            var: 'target',
            card: target,
          },
          {
            var: 'self',
            card: modifier.source,
          },
        ])
      );
    }
  }
}
