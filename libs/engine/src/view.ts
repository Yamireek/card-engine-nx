import {
  Action,
  UserCardAction,
  CardView,
  State,
  View,
} from '@card-engine-nx/state';
import { mapValues, values } from 'lodash';
import { applyAbility } from './card/ability';
import { createCardView } from './card/view';
import { sequence } from './utils/sequence';
import { keys } from 'lodash/fp';
import {
  CardId,
  GameZoneType,
  Phase,
  PlayerId,
  PlayerZoneType,
} from '@card-engine-nx/basic';

export function createEventAction(
  card: CardView,
  effect: UserCardAction,
  self: CardId,
  owner: PlayerId
): Action | undefined {
  const sphere = card.props.sphere;
  const cost = card.props.cost;

  if (!sphere || !cost) {
    return;
  }

  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { ...effect.payment, amount: cost, sphere } },
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
    { setPlayerVar: { name: 'controller', value: owner } },
    sequence({ payment: { cost: payment, effect: effect.action } }, discard),
    { setPlayerVar: { name: 'controller', value: undefined } },
    { setCardVar: { name: 'self', value: undefined } }
  );
}

export function createPlayAllyAction(
  card: CardView,
  self: CardId,
  owner: PlayerId
): Action[] {
  const sphere = card.props.sphere;
  const cost = card.props.cost;

  if (!sphere || !cost) {
    return [];
  }

  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const moveToPlay: Action = {
    card: {
      taget: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'playerArea' },
          side: 'front',
        },
      },
    },
  };

  return [
    sequence(
      { setCardVar: { name: 'self', value: self } },
      { setPlayerVar: { name: 'controller', value: owner } },
      sequence({ payment: { cost: payment, effect: moveToPlay } }),
      { setPlayerVar: { name: 'controller', value: undefined } },
      { setCardVar: { name: 'self', value: undefined } }
    ),
  ];
}

export function createPlayAttachmentAction(
  card: CardView,
  self: CardId,
  owner: PlayerId
): Action[] {
  const sphere = card.props.sphere;
  const cost = card.props.cost;

  if (!sphere || !cost || !card.attachesTo) {
    return [];
  }

  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const attachTo: Action = {
    player: {
      target: owner,
      action: {
        chooseCardActions: {
          title: 'Choose target for attachment',
          multi: false,
          optional: false,
          target: card.attachesTo,
          action: {
            attachCard: card.id,
          },
        },
      },
    },
  };

  const moveToPlay: Action = {
    card: {
      taget: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'playerArea' },
          side: 'front',
        },
      },
    },
  };

  return [
    sequence(
      { setCardVar: { name: 'self', value: self } },
      { setPlayerVar: { name: 'controller', value: owner } },
      sequence({
        payment: { cost: payment, effect: sequence(attachTo, moveToPlay) },
      }),
      { setPlayerVar: { name: 'controller', value: undefined } },
      { setCardVar: { name: 'self', value: undefined } }
    ),
  ];
}

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
