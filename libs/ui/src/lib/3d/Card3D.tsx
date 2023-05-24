import { Orientation } from "@card-engine-nx/basic";
import { CardDisplay } from "../CardDisplay";
import { rotate, rotateX, rotateZ, transform, translate } from "./utils";
import { Point3D, Images } from "@card-engine-nx/store";

export type Card3DProps = {
  id: string;
  size: { width: number; height: number };
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
        height: props.size.height,
        width: props.size.width,
        transformOrigin: "center center",
        transform:
          props.transform ??
          transform(
            translate(props.position.x, props.position.y, props.position.z),
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
          height={props.size.height}
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
          height={props.size.height}
          image={props.image.back}
          orientation={props.orientation}
        />
      </div>
    </div>
  );
};
