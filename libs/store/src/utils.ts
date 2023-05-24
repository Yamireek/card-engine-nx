import { maxBy } from "lodash";
import { Dimensions } from "./types";

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
