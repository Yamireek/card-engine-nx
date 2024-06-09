import { Tooltip } from '@mui/material';
import { useState } from 'react';
import { useMeasure } from 'react-use';
import { CardId } from '@card-engine-nx/basic';
import { CardDisplay, cardRatio } from '@card-engine-nx/ui';
import { CardDetail } from './CardDetail';
import { useGameState } from './StateContext';

export const HandLayout = (props: {
  cardWidth: number;
  cards?: Array<{ id: CardId; image: string; activable: boolean }>;
  rotate: number;
  onOver?: (id: CardId) => void;
  onActivation?: (id: CardId) => void;
}) => {
  const [ref, { width }] = useMeasure();
  const cards = props.cards ?? [];
  const { ctx } = useGameState();

  const rotate = props.rotate;
  const cardHeight = props.cardWidth / cardRatio;
  const spread = Math.min(
    ((width - props.cardWidth) * 0.9) / cards.length,
    props.cardWidth
  );
  const [detail, setDetail] = useState<CardId | undefined>(undefined);

  return (
    <Tooltip
      title={
        detail !== undefined ? (
          <CardDetail cardId={cards[detail]?.id} />
        ) : undefined
      }
      followCursor
    >
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
          {cards.map((card, i) => (
            <div
              key={card.id}
              style={{
                position: 'absolute',
                transform: `translateX(${
                  spread * i - ((cards.length - 1) * spread) / 2
                }px) rotate(${
                  rotate * i - ((cards.length - 1) * rotate) / 2
                }deg) ${
                  i === detail
                    ? `translateY(-100px) translateX(-25px) rotate(${-(
                        rotate * i -
                        ((cards.length - 1) * rotate) / 2
                      )}deg)`
                    : ''
                }`,
                transition: 'transform 0.25s ease 0s',
                zIndex: i === detail ? 5 : 0,
                border:
                  card.activable && ctx.state.choice?.type === 'actions'
                    ? '3px solid yellow'
                    : 'none',
              }}
              onClick={() => {
                if (card.activable && props.onActivation) {
                  props.onActivation(card.id);
                }
              }}
            >
              <CardDisplay
                scale={1}
                image={card.image}
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
    </Tooltip>
  );
};
