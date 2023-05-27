import React, { useRef, useState } from 'react';
import { MeshProps, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { image } from '@card-engine-nx/ui';
import { observable } from 'mobx';
import { Observer, observer } from 'mobx-react';

const store = observable({ x: 0 });

setInterval(() => {
  store.x += 0.1;
}, 1000 / 1);

const Cylinder3d = (props: any) => {
  const textureCard = useTexture({
    map: image.aragorn,
  });

  const textureBoard = useTexture({
    map: image.board,
  });

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[4000, 4000, 1]} />
        <meshPhysicalMaterial {...textureBoard} />
      </mesh>
      <mesh
        position={[0, 10, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[430, 600, 1]} />
        <meshBasicMaterial {...textureCard} />
      </mesh>
    </group>
  );
};

export default Cylinder3d;
