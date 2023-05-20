import { CardId, PrintedProps } from '@card-engine-nx/basic';
import { cloneDeep, mapValues, values } from 'lodash';
import { CardState } from './card';
import { ModifierState } from './modifier';
import { State } from './state';
import { Ability } from './types';

export type View = {
  cards: Record<CardId, CardView>;
};

export type CardView = {
  id: CardId;
  props: PrintedProps;
  abilities: Array<{ applied: boolean; ability: Ability }>;
  modifiers: Array<{ applied: boolean } & ModifierState>;
};

export function createCardView(state: CardState): CardView {
  const printed = state.definition[state.sideUp];
  return {
    id: state.id,
    props: printed,
    abilities: printed.abilities
      ? printed.abilities.map((a) => ({ applied: false, ability: a }))
      : [],
    modifiers: state.modifiers.map((m) => ({ applied: false, ...m })),
  };
}

export function toView(state: State): View {
  const view: View = cloneDeep({
    cards: mapValues(state.cards, (c) => createCardView(c)),
  });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const card of values(view.cards)) {
      for (const ability of card.abilities.filter((a) => !a.applied)) {
        allApplied = false;
        ability.ability.apply(state, card);
        ability.applied = true;
      }

      for (const modifier of card.modifiers.filter((m) => !m.applied)) {
        allApplied = false;
        modifier.modifier.apply(state, card, { selfCard: card.id });
        modifier.applied = true;
      }
    }

    if (allApplied) {
      break;
    }
  }

  return view;
}
