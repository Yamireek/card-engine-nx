import { State, View } from '@card-engine-nx/state';
import { mapValues, values } from 'lodash';
import {
  applyModifier,
  createModifiers,
  createPlayAllyAction,
  createPlayAttachmentAction,
} from './card/ability';
import { createCardView } from './card/view';
import { canExecute } from './resolution';
import { createPlayerView } from './player/view';
import { applyPlayerModifier } from './player/modifier';
import { getTargetCards } from './card';
import { getTargetPlayers } from './player/target';

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
    const abilities = c.definition[c.sideUp].abilities;
    return abilities
      .flatMap((a) => 
        createModifiers(c.id, c.controller, a, state.phase, c.zone)
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
        const targets = getTargetCards(modifier.modifier.card, {
          state,
          view,
          card: {},
          player: {},
        });

        for (const target of targets) {
          applyModifier(modifier.modifier.modifier, view.cards[target], {
            state,
            view,
            card: { self: target },
            player: {},
          });
        }
      }

      if ('player' in modifier.modifier) {
        const targets = getTargetPlayers(modifier.modifier.player, {
          state,
          view,
          card: {},
          player: {},
        });

        for (const target of targets) {
          const player = view.players[target];
          if (player) {
            applyPlayerModifier(player, modifier.modifier.modifier);
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
          card.props.sphere &&
          card.props.cost
        ) {
          view.actions.push({
            description: 'Play ally',
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
          card.props.cost &&
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
      card: { self: a.card },
      player: { controller },
    });
    return { ...a, enabled: enabled ? true : undefined };
  });

  return view;
}
