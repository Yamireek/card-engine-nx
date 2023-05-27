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
      <mesh position={[0, 0, 100]} rotation={[0, 0, 0]}>
        <planeGeometry args={[430, 600, 1]} />
        <meshPhysicalMaterial {...textureCard} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4000, 4000, 1]} />
        <meshPhysicalMaterial {...textureBoard} />
      </mesh>
    </group>
  );
};

export default Cylinder3d;
