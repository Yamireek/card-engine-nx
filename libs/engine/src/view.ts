import { State, View } from '@card-engine-nx/state';
import { mapValues, values } from 'lodash';
import { applyAbility } from './card/ability';
import { createCardView } from './card/view';
import { keys } from 'lodash/fp';
import { GameZoneType, Phase, PlayerZoneType } from '@card-engine-nx/basic';

export function createView(state: State): View {
  const view: View = {
    cards: mapValues(state.cards, (c) => createCardView(c)),
    actions: [],
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let allApplied = true;

    for (const player of values(state.players).filter((p) => !p.eliminated)) {
      for (const zoneType of keys(player.zones) as PlayerZoneType[]) {
        for (const cardId of player.zones[zoneType].cards) {
          const card = view.cards[cardId];
          for (const ability of card.abilities.filter((a) => !a.applied)) {
            allApplied = false;
            applyAbility(ability.ability, card, zoneType, {
              state,
              view,
              card: { self: card.id },
              player: {},
            });
            ability.applied = true;
          }
        }
      }
    }

    for (const zoneType of keys(state.zones) as GameZoneType[]) {
      for (const cardId of state.zones[zoneType].cards) {
        const card = view.cards[cardId];
        for (const ability of card.abilities.filter((a) => !a.applied)) {
          allApplied = false;
          applyAbility(ability.ability, card, zoneType, {
            state,
            view,
            card: {},
            player: {},
          });
          ability.applied = true;
        }
      }
    }

    if (allApplied) {
      break;
    }
  }

  return view;
}
