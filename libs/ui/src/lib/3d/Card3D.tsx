import { Orientation } from "@card-engine-nx/basic";
import { CardDisplay } from "../CardDisplay";
import { rotate, rotateX, rotateZ, scale, transform, translate } from "./utils";
import { Point3D, Images } from "@card-engine-nx/store";
import { cardSize } from "libs/store/src/utils";

export type Card3DProps = {
  id: string;
  scale: number;
  orientation: Orientation;
  position: Point3D;
  rotation: Point3D;
  image: Images;
  animationDuration?: string;
};

export const Card3D = (props: Card3DProps & { transform?: string }) => {
  return (
    <div
      key={props.id}
      style={{
        position: "absolute",
        height: cardSize.height,
        width: cardSize.width,
        transformOrigin: "center center",
        transform:
          props.transform ??
          transform(
            translate(
              props.position.x - cardSize.width / 2,
              props.position.y - cardSize.height / 2,
              props.position.z
            ),
            scale(props.scale),
            translate(cardSize.width / 2, cardSize.height / 2,0),
            rotate(props.rotation.x, props.rotation.y, props.rotation.z)
          ),
        transitionProperty: "all",
        transitionDuration: props.animationDuration || "1s",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <CardDisplay
          scale={1}
          image={props.image.front}
          orientation={props.orientation}
        />
      </div>
      <div
        style={{
          position: "absolute",
          transform: transform(rotateX(180), rotateZ(180)),
          backfaceVisibility: "hidden",
        }}
      >
        <CardDisplay
          scale={1}
          image={props.image.back}
          orientation={props.orientation}
        />
      </div>
    </div>
  );
};
