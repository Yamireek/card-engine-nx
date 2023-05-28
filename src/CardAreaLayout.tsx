import { useMemo } from 'react';
import { Vector2 } from './Card3d';
import { Dimensions, calculateItemMaxItemSize } from '@card-engine-nx/store';

export type CardAreaLayoutProps<T> = {
  position: Vector2;
  size: Dimensions;
  color: string;
  itemSize: Dimensions;
  items: T[];
  renderer: (p: {
    item: T;
    position: Vector2;
    size: Dimensions;
  }) => JSX.Element;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const CardAreaLayout = <T extends any>(
  props: CardAreaLayoutProps<T>
) => {
  const itemSize = useMemo(() => {
    const calculated = calculateItemMaxItemSize(
      props.size,
      props.itemSize,
      props.items.length
    );

    if (calculated.height < props.itemSize.height) {
      return calculated;
    }

    return props.itemSize;
  }, [props.itemSize, props.items.length, props.size]);

  return (
    <group position={[props.position[0], props.position[1], 0.0001]}>
      <mesh>
        <planeGeometry args={[props.size.width, props.size.height]} />
        <meshBasicMaterial color={props.color} opacity={0.1} transparent />
      </mesh>
      {props.items.map((item, index) => {
        const columns = Math.floor(props.size.width / itemSize.width);

        const column = index % columns;
        const row = Math.floor(index / columns);

        const rows = Math.floor(props.size.height / itemSize.height);

        const cardsInRow =
          rows === row + 1
            ? Math.floor(props.items.length % columns) === 0
              ? columns
              : Math.floor(props.items.length % columns)
            : columns;

        const remainingX = props.size.width - itemSize.width * cardsInRow;
        const remainingY = props.size.height - itemSize.height * rows;

        return props.renderer({
          item,
          size: itemSize,
          position: [
            itemSize.width * column -
              props.size.width / 2 +
              itemSize.width / 2 +
              remainingX / 2,
            -itemSize.height * row +
              props.size.height / 2 -
              itemSize.height / 2 -
              remainingY / 2,
          ],
        });
      })}
    </group>
  );
};
