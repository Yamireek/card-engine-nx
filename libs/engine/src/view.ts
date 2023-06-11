import {
  Action,
  ActivableCardAction,
  CardView,
  State,
  View,
} from '@card-engine-nx/state';
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

  return [
    sequence(
      { setCardVar: { name: 'self', value: self } },
      { setPlayerVar: { name: 'owner', value: owner } },
      sequence({ payment: { cost: payment, effect: effect } }, discard),
      { setPlayerVar: { name: 'owner', value: undefined } },
      { setCardVar: { name: 'self', value: undefined } }
    ),
  ];
}

function createPlayAllyAction(
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
      { setPlayerVar: { name: 'owner', value: owner } },
      sequence({ payment: { cost: payment, effect: moveToPlay } }),
      { setPlayerVar: { name: 'owner', value: undefined } },
      { setCardVar: { name: 'self', value: undefined } }
    ),
  ];
}

function createPlayAttachmentAction(
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
      { setPlayerVar: { name: 'owner', value: owner } },
      sequence({
        payment: { cost: payment, effect: sequence(moveToPlay, attachTo) },
      }),
      { setPlayerVar: { name: 'owner', value: undefined } },
      { setCardVar: { name: 'self', value: undefined } }
    ),
  ];
}

export function createCardActions(
  zone: PlayerZoneType,
  card: CardView,
  self: CardId,
  owner: PlayerId
): ActivableCardAction[] {
  if (zone === 'hand' && card.props.type === 'event') {
    return card.actions.flatMap((effect) =>
      createEventAction(card, effect.action, self, owner).map((action) => ({
        description: effect.description,
        action,
      }))
    );
  }

  if (zone === 'hand' && card.props.type === 'ally') {
    return createPlayAllyAction(card, self, owner).map((action) => ({
      description: `Play ally ${card.props.name}`,
      action,
    }));
  }

  if (zone === 'hand' && card.props.type === 'attachment') {
    return createPlayAttachmentAction(card, self, owner).map((action) => ({
      description: `Play attachment ${card.props.name}`,
      action,
    }));
  }

  return [];
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
        const actions = createCardActions(zoneType, card, card.id, player.id);
        for (const action of actions) {
          const allowed = canExecute(action.action, true, {
            state,
            view,
            card: { self: card.id },
            player: { owner: player.id },
          });
          if (allowed) {
            view.actions.push({
              card: card.id,
              description: action.description,
              action: action.action,
            });
          }
        }
      }
    }
  }

  return view;
}
