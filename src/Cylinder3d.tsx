import { useTexture, Text } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
import { useState, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/three';
//import { useSpring } from 'react-spring';
import { observable } from 'mobx';
import { Texture } from 'three';
import { isArray } from 'lodash';

const Cylinder3d = (props: any) => {
  const [hover, setHover] = useState(false);

  const [z, setZ] = useState(15);

  const spring = useSpring({
    position: z,
  });

  const textureCard = useTexture({
    map: image.aragorn,
  });

  const [colorMap, roughnessMap] = useTexture(
    [
      './textures/wood-2k/Wood026_2K_Color.png',
      './textures/wood-2k/Wood026_2K_Roughness.png',
    ],
    (t) => {
      if (isArray(t)) {
        for (const texture of t) {
          texture.wrapS = 1000;
          texture.wrapT = 1000;
          texture.repeat.set(1, 1);
        }
      }
    }
  );

  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000, 1, 1]} />
        <meshPhysicalMaterial map={colorMap} roughnessMap={roughnessMap} />
      </mesh>
      <animated.mesh
        // onPointerEnter={() => {
        //   setZ(0);
        // }}
        // onPointerLeave={() => {
        //   setHover(false);
        // }}
        position-z={spring.position}
        rotation={[0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[430, 600, 2]} />
        <meshPhysicalMaterial {...textureCard} />
      </animated.mesh>
    </group>
  );
};

export default Cylinder3d;
