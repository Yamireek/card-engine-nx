import { CardDisplay, cardRatio } from "./CardDisplay";

export const HandLayout = (props: {
  cardWidth: number;
  cards: number;
  spread: number;
  rotate: number;
}) => {
  const cards = Array.from(Array(props.cards), (_, index) => index);
  const spread = props.spread * props.cardWidth;
  const rotate = props.rotate;

  return (
    <div
      style={{
        display: "flex",
        width: props.cardWidth,
        margin: "auto",
        left: 0,
        right: 0,
      }}
    >
      {cards.map((c, i) => (
        <div
          style={{
            position: "absolute",
            transform: `translateX(${
              spread * i - ((cards.length - 1) * spread) / 2
            }px) rotate(${rotate * i - ((cards.length - 1) * rotate) / 2}deg)`,
            transition: "transform 0.25s ease 0s",
          }}
        >
          <CardDisplay
            height={props.cardWidth / cardRatio}
            image="https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg"
            mark={{
              attacking: true,
              attacked: true,
              defending: true,
              questing: true,
            }}
            token={{
              damage: 1,
              progress: 1,
              resources: 1,
            }}
            orientation="portrait"
          />
        </div>
      ))}
    </div>
  );
};
