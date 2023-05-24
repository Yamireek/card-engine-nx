import { computed } from 'mobx';
import {
  model,
  Model,
  idProp,
  prop,
  getParent,
  modelAction,
} from 'mobx-keystone';
import { Dimensions, Images, Point, Point3D } from './types';
import { Orientation } from '@card-engine-nx/basic';
import { calculateItemMaxItemSize, cardSize } from './utils';
import { orderBy } from 'lodash';

@model('Board')
export class BoardModel extends Model({
  height: prop<number>(),
  width: prop<number>(),
  zones: prop<ZoneModel[]>(),
  decks: prop<DeckModel[]>(),
  cards: prop<FloatingCardModel[]>(),
}) {
  @computed
  get allCards(): Array<CardModel | FloatingCardModel> {
    const cards = [...this.zones.flatMap((z) => z.cards), ...this.cards];
    return orderBy(cards, (c) => c.id);
  }

  @modelAction
  update(action: () => void) {
    action();
  }
}

@model('Zone')
export class ZoneModel extends Model({
  id: idProp,
  color: prop<string>(),
  location: prop<Point>(),
  size: prop<Dimensions>(),
  cards: prop<CardModel[]>(),
}) {
  @computed
  get cardSlotSize(): Dimensions {
    const targetSize: Dimensions = {
      width: cardSize.width * 1.2,
      height: cardSize.height * 1.2,
    };

    const calculated = calculateItemMaxItemSize(
      this.size,
      targetSize,
      this.cards.length
    );

    if (calculated.height < targetSize.height) {
      return calculated;
    }

    return targetSize;
  }
}

@model('Deck')
export class DeckModel extends Model({
  id: idProp,
  image: prop<string>(),
  position: prop<Point>(),
  orientation: prop<Orientation>(),
  cards: prop<number>(),
}) {}

@model('FloatingCard')
export class FloatingCardModel extends Model({
  id: idProp,
  images: prop<Images>(),
  rotation: prop<Point3D>(),
  orientation: prop<Orientation>(),
  position: prop<Point3D>(),
  scale: prop<number>(),
}) {}

@model('Card')
export class CardModel extends Model({
  id: idProp,
  images: prop<Images>(),
  rotation: prop<Point3D>(),
  orientation: prop<Orientation>(),
  attachments: prop<CardModel[]>(),
}) {
  @computed get zone(): ZoneModel {
    const cards = getParent(this);
    const zone = getParent(cards);
    if (zone) {
      return zone;
    } else {
      throw new Error('card without zone');
    }
  }

  @computed get index(): number {
    const index = this.zone.cards.indexOf(this);
    return index;
  }

  @computed
  get position(): Point3D {
    const columns = Math.floor(
      this.zone.size.width / this.zone.cardSlotSize.width
    );

    const column = this.index % columns;
    const row = Math.floor(this.index / columns);

    const rows = Math.floor(
      this.zone.size.height / this.zone.cardSlotSize.height
    );

    const cardsInRow =
      rows === row + 1
        ? Math.floor(this.zone.cards.length % columns) === 0
          ? columns
          : Math.floor(this.zone.cards.length % columns)
        : columns;

    const spaceX =
      this.zone.size.width - this.zone.cardSlotSize.width * cardsInRow;

    const marginX = this.zone.cardSlotSize.width * 0.2;
    const marginY = this.zone.cardSlotSize.height * 0.2;

    return {
      x:
        this.zone.location.x +
        marginX / 2 +
        +spaceX / 2 +
        this.zone.cardSlotSize.width * column,
      y:
        this.zone.location.y +
        marginY / 2 +
        this.zone.cardSlotSize.height * row,
      z: 0,
    };
  }

  @computed
  get scale(): number {
    return this.zone.cardSlotSize.height / cardSize.height / 1.2;
  }
}
