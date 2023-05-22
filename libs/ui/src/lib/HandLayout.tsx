import { useMeasure } from "react-use";
import { CardDisplay, cardRatio } from "./CardDisplay";

export const HandLayout = (props: {
  cardWidth: number;
  cardImages: string[];
  rotate: number;
}) => {
  const [ref, { width }] = useMeasure();
  const rotate = props.rotate;
  const cardHeight = props.cardWidth / cardRatio;
  const spread = Math.min(
    ((width - props.cardWidth) * 0.9) / props.cardImages.length,
    props.cardWidth
  );

  return (
    <div
      ref={ref as any}
      style={{
        width: "100%",
        height: cardHeight,
      }}
    >
      <div
        style={{
          position: "relative",
          width: props.cardWidth,
          margin: "auto",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {props.cardImages.map((image, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translateX(${
                spread * i - ((props.cardImages.length - 1) * spread) / 2
              }px) rotate(${
                rotate * i - ((props.cardImages.length - 1) * rotate) / 2
              }deg)`,
              transition: "transform 0.25s ease 0s",
            }}
          >
            <CardDisplay
              height={props.cardWidth / cardRatio}
              image={image}
              orientation="portrait"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
