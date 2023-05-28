import { useTexture, Text } from '@react-three/drei';
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
    map: image.aragorn,
  });

  const textureBoard = useTexture({
    map: image.board,
  });

  // useEffect(() => {
  //   setInterval(() => {
  //     setZ((p) => p + 100);
  //   }, 1000);
  // }, []);

  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshPhysicalMaterial {...textureBoard} />
      </mesh>
      <Text
        color="black"
        fontSize={14}
        maxWidth={320}
        lineHeight={1.15}
        letterSpacing={0.01}
        textAlign={'left'}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="left"
        anchorY="top"
        position={[-169, -146.5, 3]}
        outlineWidth={6}
        outlineColor="rgb(226,214,222)"
      >
        Response: After Aragorn commits to a quest, spend 1 resource from his
        resource pool to ready him.
      </Text>
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
        <boxGeometry args={[430, 600, 2]} />
        <meshPhysicalMaterial {...textureCard} />
      </animated.mesh>
    </group>
  );
};

export default Cylinder3d;
