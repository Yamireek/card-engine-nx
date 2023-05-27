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
  const camera = useThree((state) => state.camera);
  console.log(camera);

  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // useFrame((state, delta) => {
  //   if (ref.current) {
  //     ref.current.rotation.x = store.x;
  //     console.log(ref.current.rotation.x);
  //   }
  // });

  const texture = useTexture({
    map: image.aragorn,
  });

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => {
        hover(true);
      }}
      onPointerMove={(event) => {
        console.log(event);
      }}
      onPointerOut={(event) => hover(false)}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <planeGeometry args={[1024, 1024, 1]} />
      <meshStandardMaterial
        {...texture}
        // wireframe={props.wireframe}
        // color={hovered ? 'hotpink' : 'orange'}
      />
    </mesh>
  );
};

export default Cylinder3d;
