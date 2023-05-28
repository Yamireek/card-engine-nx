import { useTexture } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
import { useState } from 'react';
import { animated } from '@react-spring/three';
import { useSpring } from 'react-spring';

const Cylinder3d = (props: any) => {
  const [hover, setHover] = useState(false);

  const spring = useSpring({
    position: hover ? 100 : 20,
    config: { tension: 180, friction: 12 },
  });

  const textureCard = useTexture({
    map: image.test,
  });

  const textureBoard = useTexture({
    map: image.board,
  });

  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshPhysicalMaterial {...textureBoard} />
      </mesh>
      <animated.mesh
        onPointerEnter={() => {
          setHover(true);
        }}
        onPointerLeave={() => {
          setHover(false);
        }}
        position-z={spring.position}
        rotation={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[256, 256, 2]} />
        <meshPhysicalMaterial {...textureCard} />
      </animated.mesh>
    </group>
  );
};

export default Cylinder3d;
