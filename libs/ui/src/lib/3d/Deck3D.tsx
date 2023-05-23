import { Orientation } from '@card-engine-nx/basic';
import { CSSProperties } from '@mui/material/styles/createMixins';
import { CardDisplay } from '../CardDisplay';
import { Point } from './types';

const background: CSSProperties = {
  backgroundColor: 'gray',
  backgroundImage:
    'linear-gradient(0, rgba(255, 255, 255, .07) 50%, transparent 50%), linear-gradient(0, rgba(255, 255, 255, .13) 50%, transparent 50%), linear-gradient(0, transparent 50%, rgba(255, 255, 255, .17) 50%), linear-gradient(0, transparent 50%, rgba(255, 255, 255, .19) 50%)',
  backgroundSize: '13px 13px, 29px 29px, 37px 37px, 53px 53px',
};

export const Deck3D = (deck: Deck3DProps) => {
  const depth = deck.size.cards * 4;
  return (
    <div
      key={deck.id}
      style={{
        position: 'absolute',
        height: deck.size.height,
        width: deck.size.width,
        transformOrigin: 'center center',
        transform: `translateX(${deck.position.x}px) translateY(${deck.position.y}px) translateZ(${depth}px)`,
        transitionProperty: 'transform',
        transitionDuration: deck.animationDuration,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backfaceVisibility: 'hidden',
        }}
      >
        <CardDisplay
          height={deck.size.height}
          image={deck.image}
          orientation={deck.orientation}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          width: deck.size.width,
          height: depth,
          transformOrigin: 'top center',
          transform: `translateY(${deck.size.height}px) rotateX(-90deg)`,
          ...background,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: deck.size.height,
          height: depth,
          transformOrigin: 'top left',
          transform: `translateX(${deck.size.width}px) rotateX(-90deg) rotateY(-90deg)`,
          ...background,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: deck.size.height,
          height: depth,
          transformOrigin: 'top left',
          transform: `rotateX(-90deg) rotateY(-90deg)`,
          ...background,
        }}
      />
      <div
        style={{
          position: 'absolute',

          width: deck.size.width,
          height: depth,
          transformOrigin: 'top center',
          transform: `rotateX(-90deg)`,
          ...background,
        }}
      />
    </div>
  );
};

export type Deck3DProps = {
  id: number;
  size: { width: number; height: number; cards: number };
  orientation: Orientation;
  position: Point;
  image: string;
  animationDuration: string;
};
