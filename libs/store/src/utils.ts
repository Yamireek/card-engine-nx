import { maxBy } from 'lodash';
import { Dimensions } from './types';
import {
  CardDefinition,
  CardState,
  PlayerState,
  State,
} from '@card-engine-nx/state';
import { BoardModel, CardModel, DeckModel, ZoneModel } from './board';
import { CardType, PlayerId, PrintedProps, keys } from '@card-engine-nx/basic';
import { image } from '@card-engine-nx/ui';

export function calculateItemSize(
  space: Dimensions,
  item: Dimensions,
  items: number,
  rows: number
): Dimensions {
  const itemsPerRow = Math.ceil(items / rows);
  const itemsPerColumn = Math.ceil(items / itemsPerRow);

  const newItemWidth = space.width / itemsPerRow;
  const newItemHeight = space.height / itemsPerColumn;

  const scaleHeight = newItemHeight / item.height;
  const scaleWidth = newItemWidth / item.width;

  const scale = Math.min(scaleWidth, scaleHeight);

  const itemSize = {
    height: Math.floor(item.height * scale),
    width: Math.floor(item.width * scale),
  };

  return itemSize;
}

export function calculateItemMaxItemSize(
  space: Dimensions,
  item: Dimensions,
  items: number
): Dimensions {
  const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) =>
    calculateItemSize(space, item, items, i)
  );

  const maxSize = maxBy(sizes, (s) => s.height) || item;

  return {
    height: Math.round(maxSize.height),
    width: Math.round(maxSize.width),
  };
}

export const cardSize: Dimensions = {
  height: 600,
  width: 430,
};

export function getCardImageUrl(props: PrintedProps): string {
  const name = props.name || props.type;
  return `https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/${name
    .split(' ')
    .join('-')}.jpg`;
}

export function creteCardModel(state: CardState): CardModel {
  const def = state.definition[state.sideUp];
  return new CardModel({
    attachments: [],
    images: { front: getCardImageUrl(def), back: '' },
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
    new DeckModel({id: `${playerId}/discardPile`,
      cards: player.zones.discardPile.cards.length,
      image: image.playerBack,
      orientation: 'portrait',
      position: {
        x: 4824 - 430 - 46,
        y: 4860 - 800,
      },
    }),

    new DeckModel({id: `${playerId}/library`,
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
