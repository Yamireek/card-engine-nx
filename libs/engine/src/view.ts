import { Action, CardView, State, View } from '@card-engine-nx/state';
import { mapValues, values } from 'lodash';
import { applyModifier } from './card/modifier';
import { applyAbility } from './card/ability';
import { createCardView } from './card/view';
import { canExecute } from './resolution';
import { sequence } from './utils/sequence';
import { keys } from 'lodash/fp';
import { CardId, PlayerId, PlayerZoneType } from '@card-engine-nx/basic';

function createEventAction(
  card: CardView,
  effect: Action,
  self: CardId,
  owner: PlayerId
): Action | undefined {
  const sphere = card.props.sphere;
  const cost = card.props.cost;

  if (!sphere || !cost) {
    return undefined;
  }

  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const discard: Action = {
    card: {
      taget: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'discardPile' },
          side: 'front',
        },
      },
    },
  };

  return sequence(
    { setCardVar: { name: 'self', value: self } },
    { setPlayerVar: { name: 'owner', value: owner } },
    sequence({ payment: { cost: payment, effect: effect } }, discard),
    { setPlayerVar: { name: 'owner', value: undefined } },
    { setCardVar: { name: 'self', value: undefined } }
  );
}

export function createView(state: State): View {
  const view: View = {
    cards: mapValues(state.cards, (c) => createCardView(c)),
    actions: [],
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const card of values(view.cards)) {
      for (const ability of card.abilities.filter((a) => !a.applied)) {
        allApplied = false;
        applyAbility(ability.ability, card);
        ability.applied = true;
      }

      for (const modifier of card.modifiers.filter((m) => !m.applied)) {
        allApplied = false;
        applyModifier(modifier.modifier, card, {
          state,
          view,
          card: { self: card.id },
          player: {},
        });
        modifier.applied = true;
      }
    }

    if (allApplied) {
      break;
    }
  }

  for (const player of values(state.players).filter((p) => !p.eliminated)) {
    for (const zoneType of keys(player.zones) as PlayerZoneType[]) {
      for (const cardId of player.zones[zoneType].cards) {
        const card = view.cards[cardId];
        if (zoneType === 'hand' && card.props.type === 'event') {
          for (const action of card.actions) {
            const eventAction = createEventAction(
              card,
              action.action,
              card.id,
              player.id
            );
            if (eventAction) {
              const allowed = canExecute(eventAction, true, {
                state,
                view,
                card: { self: card.id },
                player: { owner: player.id },
              });
              if (allowed) {
                view.actions.push({
                  card: card.id,
                  description: action.description,
                  action: eventAction,
                });
              }
            }
          }
        }
      }
    }
  }

  return view;
}
