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

@model("Zone")
export class ZoneModel extends Model({
  id: idProp,
  location: prop<Point>(),
  size: prop<Dimensions>(),
  orientation: prop<Orientation>(),
  cards: prop<CardModel[]>(),
}) {
  // @computed
  // get cardScale(): number {
  //   const calculated = calculateItemMaxItemSize(
  //     this.size,
  //     cardSize,
  //     this.cards.length
  //   );

  //   const scale = calculated.height / cardSize.height;

  //   if (scale >= 1) {
  //     return 1;
  //   } else {
  //     return scale;
  //   }
  // }

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

@model("Deck")
export class DeckModel extends Model({
  id: idProp,
  image: prop<string>(),
  position: prop<Point>(),
  orientation: prop<Orientation>(),
  cards: prop<number>(),
}) {}

@model("FloatingCard")
export class FloatingCardModel extends Model({
  id: idProp,
  images: prop<Images>(),
  rotation: prop<Point3D>(),
  orientation: prop<Orientation>(),
  position: prop<Point3D>(),
  scale: prop<number>(),
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
    const columns = Math.floor(
      this.zone.size.width / this.zone.cardSlotSize.width
    );

    const spaceX = this.zone.cardSlotSize.width * 0.2;
    const spaceY = this.zone.cardSlotSize.height * 0.2;
    return {
      x:
        this.zone.location.x +
        spaceX / 2 +
        this.zone.cardSlotSize.width * (this.index % columns),
      y:
        this.zone.location.y +
        spaceY / 2 +
        this.zone.cardSlotSize.height * Math.floor(this.index / columns),
      z: 0,
    };
  }

  @computed
  get scale(): number {
    return this.zone.cardSlotSize.height / cardSize.height / 1.2;
  }
}
