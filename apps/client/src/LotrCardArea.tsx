import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardId, Orientation } from '@card-engine-nx/basic';
import { cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { CardState } from '@card-engine-nx/state';
import { max } from 'lodash/fp';
import React from 'react';
import { LotrCard3d } from './LotrCard3d';

export const LotrCardArea = (props: {
  layout: Omit<
    CardAreaLayoutProps<CardState>,
    'itemSize' | 'items' | 'renderer'
  >;
  cards: CardId[];
  orientation?: Orientation;
}) => {
  const { state } = useContext(StateContext);

  const items = props.cards
    .map((id) => state.cards[id])
    .filter((c) => !c.attachedTo && !c.shadowOf);

  const maxAttachments = max(items.map((i) => i.attachments.length)) ?? 0;

  const itemSize = {
    width: cardSize.width * 1.1,
    height: cardSize.height * (1.1 + maxAttachments * 0.2),
  };

  return (
    <CardAreaLayout
      {...props.layout}
      itemSize={itemSize}
      items={items}
      renderer={(p) => {
        const fullHeight = p.size.height;
        const scale = p.size.width / cardSize.width;
        const cardHeight = cardSize.height * scale;
        const offsetMin = -(fullHeight - cardHeight) / 2;
        const offsetMax = (fullHeight - cardHeight) / 2;
        const diff = (offsetMax - offsetMin) / p.item.attachments.length;
        const realItemSize = {
          width: p.size.width / 1.1,
          height: p.size.height / 1.1,
        };

        return (
          <React.Fragment key={p.item.id}>
            <LotrCard3d
              cardId={p.item.id}
              position={[p.position[0], p.position[1] + offsetMin, 0.01]}
              size={realItemSize}
              orientation={props.orientation}
            />
            {p.item.attachments.map((a, i) => {
              return (
                <LotrCard3d
                  key={a}
                  cardId={a}
                  size={realItemSize}
                  position={[
                    p.position[0],
                    p.position[1] + offsetMin + diff * (i + 1),
                    0.01 - (i + 1) * 0.001,
                  ]}
                />
              );
            })}
            {p.item.shadows.map((a, i) => {
              return (
                <LotrCard3d
                  key={a}
                  cardId={a}
                  size={realItemSize}
                  position={[
                    p.position[0],
                    p.position[1] - 0.02,
                    0.01 - (i + 1) * 0.001,
                  ]}
                />
              );
            })}
          </React.Fragment>
        );
      }}
    />
  );
};
