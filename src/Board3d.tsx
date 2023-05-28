import { useTexture } from '@react-three/drei';

export const Board3d = () => {
  const [colorMap, roughnessMap, normalMap] = useTexture([
    './textures/wood-2k/Wood026_2K_Color.png',
    './textures/wood-2k/Wood026_2K_Roughness.png',
    './textures/wood-2k/Wood026_2K_NormalGL.png',
  ]);

  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshPhysicalMaterial
        map={colorMap}
        roughnessMap={roughnessMap}
        normalMap={normalMap}
      />
    </mesh>
  );
};
