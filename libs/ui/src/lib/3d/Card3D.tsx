import { Orientation } from '@card-engine-nx/basic';
import { Point3D } from './types';
import { CardDisplay } from '../CardDisplay';

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

export const Card3D = (props: Card3DProps) => {
  return (
    <div
      key={props.id}
      style={{
        position: 'absolute',
        height: props.size.height,
        width: props.size.width,
        transformOrigin: 'center center',
        transform: `
          translateX(${props.position.x}px) translateY(${props.position.y}px) translateZ(${props.position.z}px) 
          rotateX(${props.rotation.x}deg) rotateY(${props.rotation.y}deg) rotateZ(${props.rotation.z}deg)`,
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
          transform: `rotateX(180deg) rotateZ(180deg)`,
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
