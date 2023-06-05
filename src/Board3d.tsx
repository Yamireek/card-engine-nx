import { useTextures } from "@card-engine-nx/ui";

export const Board3d = () => {
  const { material } = useTextures();

  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshPhysicalMaterial
        map={material.wood.color}
        roughnessMap={material.wood.roughness}
        normalMap={material.wood.normal}
      />
    </mesh>
  );
};
