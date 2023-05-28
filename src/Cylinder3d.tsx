import { useTexture } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
import { useState, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/three';
//import { useSpring } from 'react-spring';
import { observable } from 'mobx';

const Cylinder3d = (props: any) => {
  const [hover, setHover] = useState(false);

  const [z, setZ] = useState(1);

  const spring = useSpring({
    position: z,
  });

  const textureCard = useTexture({
    map: image.test,
  }); 

  const textureBoard = useTexture({
    map: image.board,
  });

  useEffect(() => {
    setInterval(() => {
      setZ((p) => p + 100);
    }, 1000);
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshPhysicalMaterial {...textureBoard} />
      </mesh>
      <animated.mesh
        onPointerEnter={() => {
          setZ(0);
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
