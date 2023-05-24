import { Orientation } from '@card-engine-nx/basic';
import { CSSProperties } from '@mui/material/styles/createMixins';
import { CardDisplay } from '../CardDisplay';
import { Point, cardSize } from '@card-engine-nx/store';

const background: CSSProperties = {
  backgroundColor: 'gray',
  backgroundImage:
    'linear-gradient(0, rgba(255, 255, 255, .07) 50%, transparent 50%), linear-gradient(0, rgba(255, 255, 255, .13) 50%, transparent 50%), linear-gradient(0, transparent 50%, rgba(255, 255, 255, .17) 50%), linear-gradient(0, transparent 50%, rgba(255, 255, 255, .19) 50%)',
  backgroundSize: '13px 13px, 29px 29px, 37px 37px, 53px 53px',
};

export type Deck3DProps = {
  id: string;
  cards: number;
  orientation: Orientation;
  position: Point;
  image: string;
  animationDuration?: string;
};

export const Deck3D = (deck: Deck3DProps) => {
  const depth = deck.cards * 4;
  return (
    <div
      key={deck.id}
      style={{
        position: 'absolute',
        height: cardSize.height,
        width: cardSize.width,
        transformOrigin: 'center center',
        transform: `translateX(${deck.position.x}px) translateY(${deck.position.y}px) translateZ(${depth}px)`,
        transitionProperty: 'transform',
        transitionDuration: deck.animationDuration,
        transformStyle: 'preserve-3d',
      }}
    >
      {deck.cards === 0 ? (
        <div
          style={{
            position: 'absolute',
            width: cardSize.width,
            height: cardSize.height,
            backgroundColor: 'white',
            opacity: 0.05,
          }}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              backfaceVisibility: 'hidden',
            }}
          >
            <CardDisplay
              scale={1}
              image={deck.image}
              orientation={deck.orientation}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              width: cardSize.width,
              height: depth,
              transformOrigin: 'top center',
              transform: `translateY(${cardSize.height}px) rotateX(-90deg)`,
              ...background,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: cardSize.height,
              height: depth,
              transformOrigin: 'top left',
              transform: `translateX(${cardSize.width}px) rotateX(-90deg) rotateY(-90deg)`,
              ...background,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: cardSize.height,
              height: depth,
              transformOrigin: 'top left',
              transform: `rotateX(-90deg) rotateY(-90deg)`,
              ...background,
            }}
          />
          <div
            style={{
              position: 'absolute',

              width: cardSize.width,
              height: depth,
              transformOrigin: 'top center',
              transform: `rotateX(-90deg)`,
              ...background,
            }}
          />
        </>
      )}
    </div>
  );
};
