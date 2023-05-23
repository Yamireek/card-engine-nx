import { computed, toJS } from 'mobx';
import { model, Model, idProp, prop } from 'mobx-keystone';
import { Dimensions, Images, Point, Point3D } from './types';
import { Orientation } from '@card-engine-nx/basic';

@model('Board')
export class BoardModel extends Model({
  height: prop<number>(),
  width: prop<number>(),
  zones: prop<ZoneModel[]>(),
  decks: prop<DeckModel[]>(),
}) {}

@model('Zone')
export class ZoneModel extends Model({
  id: idProp,
  location: prop<Point>(),
  size: prop<Dimensions>(),
  orientation: prop<Orientation>(),
  cards: prop<CardModel[]>(),
}) {}

@model('Deck')
export class DeckModel extends Model({
  id: idProp,
  image: prop<string>(),
  location: prop<Point>(),
  size: prop<Dimensions>(),
  cards: prop<CardModel[]>(),
}) {}

@model('Card')
export class CardModel extends Model({
  id: idProp,
  images: prop<Images>(),
  rotation: prop<Point3D>(),
  orientation: prop<Orientation>(),
  attachments: prop<CardModel[]>(),
}) {
  @computed
  get position(): Point {
    throw new Error('not implemented');
  }
}

const board = new BoardModel({
  height: 1000,
  width: 1000,
  zones: [
    new ZoneModel({
      cards: [],
      location: { x: 0, y: 0 },
      size: { width: 430, height: 600 },
      orientation: 'portrait',
    }),
  ],
  decks: [],
});

console.log(toJS(board));
