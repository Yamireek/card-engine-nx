import { Texture } from "three";
import {
  GameZoneType,
  Orientation,
  PlayerId,
  PlayerZoneType,
} from "@card-engine-nx/basic";
import { cardSize } from "./Card3d";
import { Vector3, useTextures } from "@card-engine-nx/ui";
import { Text } from "@react-three/drei";

export type Deck3dProps = {
  owner: "game" | PlayerId;
  type: GameZoneType | PlayerZoneType;
  position: Vector3;
  texture: Texture;
  cardCount: number;
  orientation?: Orientation;
};

export const Deck3d = (props: Deck3dProps) => {
  const { material } = useTextures();

  const depth = props.cardCount * cardSize.depth;

  return (
    <group
      key={props.cardCount > 0 ? "cards" : "empty"}
      name={`deck-${props.owner}-${props.type}`}
      position={[
        props.position[0],
        props.position[1],
        props.cardCount > 0 ? depth / 2 : 0.0001,
      ]}
      castShadow={props.cardCount > 0}
    >
      <mesh>
        {props.cardCount > 0 ? (
          <>
            <boxGeometry
              args={
                props.orientation === "landscape"
                  ? [cardSize.height, cardSize.width, depth]
                  : [cardSize.width, cardSize.height, depth]
              }
            />
            <meshBasicMaterial attach="material-0" color="gray" />
            <meshBasicMaterial attach="material-1" color="gray" />
            <meshBasicMaterial attach="material-2" color="gray" />
            <meshBasicMaterial attach="material-3" color="gray" />
            <meshPhysicalMaterial
              attach="material-4"
              map={props.texture}
              roughnessMap={material.wood.roughness}
              normalMap={material.wood.normal}
            />
            <meshPhysicalMaterial
              attach="material-5"
              map={props.texture}
              roughnessMap={material.wood.roughness}
              normalMap={material.wood.normal}
            />
          </>
        ) : (
          <>
            <planeGeometry args={[cardSize.width, cardSize.height, 1, 1]} />
            <meshBasicMaterial color="white" opacity={0.2} transparent />
          </>
        )}
      </mesh>
      <Text
        position={[0, 0, depth / 2 + 0.0001]}
        color="black"
        outlineColor="white"
        outlineWidth={0.0005}
        fontSize={0.007}
      >
        {props.type} ({props.cardCount})
      </Text>
    </group>
  );
};
