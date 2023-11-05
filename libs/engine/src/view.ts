import { State, View } from '@card-engine-nx/state';
import { mapValues, values } from 'lodash';
import { createModifiers } from './card/modifier/create';
import { createPlayAttachmentAction } from './card/action/play/attachment';
import { createPlayAllyAction } from './card/action/play/ally';
import { applyModifier } from './card/modifier/apply';
import { createCardView } from './card/view';
import { canExecute } from './action/executable';
import { createPlayerView } from './player/view';
import { applyPlayerModifier } from './player/modifier/apply';
import { getTargetPlayers } from './player/target/multi';
import { calculateBoolExpr } from './expression/bool/calculate';
import { ViewContext } from './context/view';
import { getZoneType } from './zone/utils';
import { asArray } from './utils';
import { getTargetCards } from './card/target/multi';

export function createView(state: State): View {
  const view: View = {
    cards: mapValues(state.cards, (c) => createCardView(c)),
    players: mapValues(state.players, (p) =>
      p ? createPlayerView(p) : undefined
    ),
    actions: [],
    modifiers: [],
    responses: {},
    setup: [],
  };

  view.modifiers = values(state.cards).flatMap((c) => {
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

  view.modifiers.push(
    ...state.modifiers.map((m) => ({ applied: false, modifier: m }))
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const modifier of view.modifiers.filter((m) => !m.applied)) {
      allApplied = false;

      if ('card' in modifier.modifier) {
        const sourceCard = state.cards[modifier.modifier.source];

        const targets = getTargetCards(modifier.modifier.card, {
          state,
          view,
          scopes: [
            { player: { controller: asArray(sourceCard.controller) } },
            { card: { self: asArray(modifier.modifier.source) } },
          ],
        });

        for (const target of targets) {
          const ctx: ViewContext = {
            state,
            view,
            scopes: [
              {
                card: {
                  target: asArray(target),
                  self: asArray(modifier.modifier.source),
                },
              },
            ],
          };
          const condition = modifier.modifier.condition
            ? calculateBoolExpr(modifier.modifier.condition, ctx)
            : true;
          if (condition) {
            applyModifier(
              modifier.modifier.modifier,
              view.cards[target],
              modifier.modifier.source,
              ctx
            );
          }
        }
      }

      if ('player' in modifier.modifier) {
        const ctx: ViewContext = {
          state,
          view,
          scopes: [{ card: { self: asArray(modifier.modifier.source) } }],
        };

        const condition = modifier.modifier.condition
          ? calculateBoolExpr(modifier.modifier.condition, ctx)
          : true;

        if (condition) {
          const targets = getTargetPlayers(modifier.modifier.player, ctx);

          for (const target of targets) {
            const player = view.players[target];
            if (player) {
              applyPlayerModifier(player, modifier.modifier.modifier);
            }
          }
        }
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
            description: 'Play ally',
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

  view.actions = view.actions.map((a) => {
    const controller = state.cards[a.card].controller;
    const enabled = canExecute(a.action, true, {
      state: state,
      view: view,
      scopes: [
        {
          player: { controller: controller ? [controller] : [] },
          card: { self: asArray(a.card) },
        },
      ],
    });
    return { ...a, enabled: enabled ? true : undefined };
  });

  return view;
}
