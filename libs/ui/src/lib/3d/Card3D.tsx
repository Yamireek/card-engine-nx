import { Orientation } from '@card-engine-nx/basic';
import { Point3D } from './types';
import { CardDisplay } from '../CardDisplay';
import { rotate, rotateX, rotateZ, transform, translate } from './utils';

export type Card3DProps = {
  id: number;
  size: { width: number; height: number };
  orientation: Orientation;
  position: Point3D;
  rotation: Point3D;
  image: {
    front: string;
    back: string;
  };
  animationDuration: string;
};

export const Card3D = (props: Card3DProps & { transform?: string }) => {
  return (
    <div
      key={props.id}
      style={{
        position: 'absolute',
        height: props.size.height,
        width: props.size.width,
        transformOrigin: 'center center',
        transform:
          props.transform ??
          transform(
            translate(props.position.x, props.position.y, props.position.z),
            rotate(props.rotation.x, props.rotation.y, props.rotation.z)
          ),
        transitionProperty: 'transform',
        transitionDuration: props.animationDuration,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backfaceVisibility: 'hidden',
        }}
      >
        <CardDisplay
          height={props.size.height}
          image={props.image.front}
          orientation={props.orientation}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          transform: transform(rotateX(180), rotateZ(180)),
          backfaceVisibility: 'hidden',
        }}
      >
        <CardDisplay
          height={props.size.height}
          image={props.image.back}
          orientation={props.orientation}
        />
      </div>
    </div>
  );
};
