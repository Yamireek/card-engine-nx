import { State, View } from '@card-engine-nx/state';
import { mapValues, values } from 'lodash';
import { applyModifier } from './card/modifier';
import { applyAbility } from './card/ability';
import { createCardView } from './card/view';
import { emptyEvents } from './uiEvents';
import { canExecute } from './resolution';
import { sequence } from './utils/sequence';

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
          events: emptyEvents,
          shuffle: (v) => v,
        });
        modifier.applied = true;
      }
    }

    if (allApplied) {
      break;
    }
  }

  for (const card of values(view.cards)) {
    for (const action of card.actions) {
      const allowed = canExecute(action.action, true, {
        state,
        view,
        card: { self: card.id },
        events: emptyEvents,
        shuffle: (v) => v,
      });
      if (allowed) {
        view.actions.push({
          card: card.id,
          description: action.description,
          action: sequence(
            { setCardVar: { name: 'self', value: card.id } },
            action.action,
            { setCardVar: { name: 'self', value: undefined } }
          ),
        });
      }
    }
  }

  return view;
}
