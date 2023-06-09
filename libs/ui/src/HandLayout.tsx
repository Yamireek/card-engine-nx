import { useMeasure } from 'react-use';
import { CardDisplay, cardRatio } from './CardDisplay';
import { useState } from 'react';

export const HandLayout = (props: {
  cardWidth: number;
  cardImages?: string[];
  rotate: number;
}) => {
  const [ref, { width }] = useMeasure();

  const images = props.cardImages ?? [];

  const rotate = props.rotate;
  const cardHeight = props.cardWidth / cardRatio;
  const spread = Math.min(
    ((width - props.cardWidth) * 0.9) / images.length,
    props.cardWidth
  );
  const [detail, setDetail] = useState<number | undefined>(undefined);

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{
        width: '100%',
        height: cardHeight,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: props.cardWidth,
          margin: 'auto',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {images.map((image, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `translateX(${
                spread * i - ((images.length - 1) * spread) / 2
              }px) rotate(${
                rotate * i - ((images.length - 1) * rotate) / 2
              }deg) ${
                i === detail
                  ? `translateY(-25px) translateX(-25px) rotate(${-(
                      rotate * i -
                      ((images.length - 1) * rotate) / 2
                    )}deg)`
                  : ''
              }`,
              transition: 'transform 0.25s ease 0s',
            }}
          >
            <CardDisplay
              scale={1}
              image={image}
              orientation="portrait"
              onMouseEnter={() => {
                setDetail(i);
              }}
              onMouseLeave={() => setDetail(undefined)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
