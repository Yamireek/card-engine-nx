import { CardDisplay, cardRatio } from "./CardDisplay";

export const HandLayout = (props: { cardWidth: number; cards: number }) => {
  const cards = Array.from(Array(props.cards), (_, index) => index);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%",
        maxWidth: cards.length * props.cardWidth + (cards.length - 1) * 8,
        margin: "auto",
        left: 0,
        right: 0,
      }}
    >
      {cards.map((c, i) => (
        <div
          key={c}
          style={{
            flex: cards.length - 1 === i ? "0 0 auto" : undefined,
            overflowX: "hidden",
            transitionProperty: "all",
            transitionDuration: "1s",
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
