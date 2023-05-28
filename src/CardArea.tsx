import { Vector2, Vector3 } from './Card3d';
import { Dimensions } from '@card-engine-nx/store';
//import { useSpring } from 'react-spring';

export type CardAreaProps = React.PropsWithChildren<{
  position: Vector2;
  size: Dimensions;
  color: string;
}>;

export const CardArea = (props: CardAreaProps) => {
  return (
    <group position={[props.position[0], props.position[1], 0.0001]}>
      <mesh>
        <planeGeometry args={[props.size.width, props.size.height]} />
        <meshBasicMaterial color={props.color} opacity={0.1} transparent />
      </mesh>
      {props.children}
    </group>
  );
};
