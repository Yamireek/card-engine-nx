import { PrintedProps, PlayerId } from '@card-engine-nx/basic';
import { CardState, State } from '@card-engine-nx/state';
import {
  CardModel,
  BoardModel,
  ZoneModel,
  DeckModel,
} from '@card-engine-nx/store';
import { image } from '..';

export function getCardImageUrl(props: PrintedProps): string {
  if (props.type === 'player_back') {
    return image.playerBack;
  }

  if (props.type === 'encounter_back') {
    return image.encounterBack;
  }

  const name = props.name || props.type;
  return `./images/cards/01-core/${name.replace("'", '_')}.jpg`;
}

export function creteCardModel(state: CardState): CardModel {
  return new CardModel({
    attachments: [],
    images: {
      front: getCardImageUrl(state.definition.front) ?? '',
      back: getCardImageUrl(state.definition.back) ?? '',
    },
    orientation: 'portrait',
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  });
}

export function createBoardModel(state: State): BoardModel {
  return new BoardModel({
    cards: [],

    height: 1620,
    width: 1608,
    zones: [
      new ZoneModel({
        color: 'yellow',
        cards: [],
        location: { x: 0, y: 0 },
        size: { width: 1000, height: 1000 },
      }),
      new ZoneModel({
        color: 'red',
        cards: [],
        location: { x: 1000, y: 0 },
        size: { width: 1000, height: 1000 },
      }),
      new ZoneModel({
        color: 'blue',
        cards: [],
        location: { x: 2000, y: 0 },
        size: { width: 1000, height: 1000 },
      }),
      ...createPlayerZones(state, 'A'),
      ...createPlayerZones(state, 'B'),
      ...createPlayerZones(state, 'C'),
      ...createPlayerZones(state, 'D'),
    ],
    decks: [
      ...createPlayerDecks(state, 'A'),
      ...createPlayerDecks(state, 'B'),
      ...createPlayerDecks(state, 'C'),
      ...createPlayerDecks(state, 'D'),
      new DeckModel({
        cards: state.zones.encounterDeck.cards.length,
        image: image.encounterBack,
        orientation: 'portrait',
        position: {
          x: 2000,
          y: 1000,
        },
      }),
      new DeckModel({
        cards: state.zones.discardPile.cards.length,
        image: image.encounterBack,
        orientation: 'portrait',
        position: {
          x: 2000,
          y: 1000,
        },
      }),
    ],
  });
}
function createPlayerZones(state: State, playerId: PlayerId) {
  const player = state.players[playerId];
  if (!player) {
    return [];
  }
  return [
    new ZoneModel({
      id: `${playerId}/engaged`,
      color: 'red',
      cards: player.zones.engaged.cards.map((id) =>
        creteCardModel(state.cards[id])
      ),
      location: { x: 0, y: 4860 - 3000 },
      size: { width: 4824, height: 1000 },
    }),
    new ZoneModel({
      id: `${playerId}/playerArea`,
      color: 'yellow',
      cards: player.zones.playerArea.cards.map((id) =>
        creteCardModel(state.cards[id])
      ),
      location: { x: 0, y: 4860 - 2000 },
      size: { width: 4824, height: 1000 },
    }),
    new ZoneModel({
      id: `${playerId}/hand`,
      color: 'green',
      cards: player.zones.hand.cards.map((id) =>
        creteCardModel(state.cards[id])
      ),
      location: { x: 0, y: 4860 - 1000 },
      size: { width: 4824 - 1000, height: 1000 },
    }),
  ];
}

function createPlayerDecks(state: State, playerId: PlayerId) {
  const player = state.players[playerId];
  if (!player) {
    return [];
  }
  return [
    new DeckModel({
      id: `${playerId}/discardPile`,
      cards: player.zones.discardPile.cards.length,
      image: image.playerBack,
      orientation: 'portrait',
      position: {
        x: 4824 - 430 - 46,
        y: 4860 - 800,
      },
    }),

    new DeckModel({
      id: `${playerId}/library`,
      cards: player.zones.library.cards.length,
      image: image.playerBack,
      orientation: 'portrait',
      position: {
        x: 4824 - 430 - 46 - 430 - 46,
        y: 4860 - 800,
      },
    }),
  ];
}
