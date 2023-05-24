import { computed } from "mobx";
import {
  model,
  Model,
  idProp,
  prop,
  getParent,
  modelAction,
} from "mobx-keystone";
import { Dimensions, Images, Point, Point3D } from "./types";
import { Orientation } from "@card-engine-nx/basic";
import { calculateItemMaxItemSize, cardSize } from "./utils";
import { orderBy } from "lodash";

@model("Board")
export class BoardModel extends Model({
  height: prop<number>(),
  width: prop<number>(),
  zones: prop<ZoneModel[]>(),
  decks: prop<DeckModel[]>(),
}) {
  @computed
  get cards(): CardModel[] {
    const cards = this.zones.flatMap((z) => z.cards);
    return orderBy(cards, (c) => c.id);
  }

  @modelAction
  update(action: () => void) {
    action();
  }
}

@model("Zone")
export class ZoneModel extends Model({
  id: idProp,
  location: prop<Point>(),
  size: prop<Dimensions>(),
  orientation: prop<Orientation>(),
  cards: prop<CardModel[]>(),
}) {
  @computed
  get cardScale(): number {
    const calculated = calculateItemMaxItemSize(
      this.size,
      cardSize,
      this.cards.length
    );

    const scale = calculated.height / cardSize.height;

    if (scale >= 1) {
      return 1;
    } else {
      return scale;
    }
  }

  @computed
  get cardSize(): Dimensions {
    return {
      height: this.cardScale * cardSize.height,
      width: this.cardScale * cardSize.width,
    };
  }
}

@model("Deck")
export class DeckModel extends Model({
  id: idProp,
  image: prop<string>(),
  location: prop<Point>(),
  size: prop<Dimensions>(),
  cards: prop<CardModel[]>(),
}) {}

@model("Card")
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
      throw new Error("card without zone");
    }
  }

  @computed get index(): number {
    const index = this.zone.cards.indexOf(this);
    return index;
  }

  @computed
  get position(): Point3D {
    const x = this.zone.size.width / this.zone.cardSize.width;
    const width = Math.floor(x);
    return {
      x: this.zone.location.x + this.zone.cardSize.width * (this.index % width),
      y:
        this.zone.location.y +
        this.zone.cardSize.height * Math.floor(this.index / width),
      z: 0,
    };
  }

  @computed
  get scale(): number {
    return this.zone.cardScale;
  }
}
