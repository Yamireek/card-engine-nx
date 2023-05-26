import {
  image,
  NextStepButton,
  createBoardModel,
  getCardImageUrl,
  HandLayout,
  BoardCamera,
  Card3D,
  Deck3D,
} from '@card-engine-nx/ui';
import { Playmat, Location3D } from './app';
import { useContext, useMemo } from 'react';
import { StateContext, useGameState } from './StateContext';
import { Observer } from 'mobx-react';
import {
  DeckModel,
  FloatingCardModel,
  cardSize,
  ZoneModel,
  CardModel,
} from '@card-engine-nx/store';
import { advanceToChoiceState } from './tests/GameEngine';
import { Events, executeAction } from '@card-engine-nx/engine';
import { PlayerId } from '@card-engine-nx/basic';

const boardSize = { width: 1608 * 4, height: 1620 * 4 };
const offset = { x: -boardSize.width / 2, y: -boardSize.height / 2 };

export const GameDisplay = () => {
  const { state, setState } = useContext(StateContext);

  const board = useMemo(() => {
    return createBoardModel(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const events = useMemo<Events>(() => {
    return {
      onCardMoved(cardId, source, destination, side) {
        const cardState = state.cards[cardId];
        board.animate([
          {
            stamp: 0,
            action: () => {
              const sourceZone = board.getZone(source);
              if (sourceZone instanceof DeckModel) {
                board.cards.push(
                  new FloatingCardModel({
                    id: cardId.toString(),
                    images: {
                      front: getCardImageUrl(cardState.definition.front),
                      back: sourceZone.image,
                    },
                    orientation: sourceZone.orientation,
                    position: {
                      ...sourceZone.position,
                      z: sourceZone.cards * 4,
                    },
                    rotation: { x: 0, y: 180, z: 0 },
                    scale: 1,
                  })
                );
                sourceZone.cards -= 1;
              } else {
                throw new Error('not implemented');
              }
            },
          },
          {
            stamp: 100,
            action() {
              const card = board.cards.find((c) => c.id === cardId.toString());
              if (card) {
                card.position = {
                  ...card.position,
                  z: card.position.z + cardSize.width / 2,
                };
              }
            },
          },
          {
            stamp: 500,
            action() {
              const card = board.cards.find((c) => c.id === cardId.toString());
              if (card) {
                card.rotation = { x: 0, y: 0, z: 0 };
              }
            },
          },
          {
            stamp: 1000,
            action() {
              const card = board.cards.pop();
              const zone = board.getZone(destination);
              if (card) {
                if (zone instanceof ZoneModel) {
                  zone.cards.push(
                    new CardModel({
                      id: card.id,
                      attachments: [],
                      images: { ...card.images },
                      orientation: card.orientation,
                      rotation: { x: 0, y: 0, z: 0 },
                    })
                  );
                }
              }
            },
          },
        ]);
      },
      onError(message) {
        return;
      },
      updateUi(newState) {
        setState({ ...newState });
      },
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button
        onClick={() => {
          executeAction(
            {
              sequence: [
                { shuffle: { zone: { owner: 'A', type: 'library' } } },
                {
                  player: {
                    target: 'A',
                    action: {
                      incrementThreat: {
                        fromCard: {
                          sum: true,
                          value: 'threadCost',
                          card: { and: [{ owner: 'A', type: ['hero'] }] },
                        },
                      },
                    },
                  },
                },
              ],
            },
            state,
            events
          );

          advanceToChoiceState(state, events);

          executeAction(
            { player: { action: { draw: 7 }, target: 'each' } },
            state,
            events
          );

          advanceToChoiceState(state, events);
        }}
      >
        draw
      </button>

      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: '100%' }}>
          <BoardCamera angle={15} rotation={0}>
            <Playmat image={image.board} size={boardSize} />
            <Observer>
              {() => (
                <>
                  {board.zones.map((z) => (
                    <Location3D
                      key={z.id}
                      position={{
                        x: z.location.x + offset.x,
                        y: z.location.y + offset.y,
                        z: 0,
                      }}
                      rotation={{ x: 0, y: 0, z: 0 }}
                    >
                      <div
                        key={z.id}
                        style={{
                          backgroundColor: z.color,
                          opacity: 0.1,
                          width: z.size.width,
                          height: z.size.height,
                        }}
                      />
                    </Location3D>
                  ))}

                  {board.allCards.map((d) => (
                    <Card3D
                      key={d.id}
                      id={d.id}
                      image={d.images}
                      orientation={d.orientation}
                      position={{
                        x: d.position.x + offset.x,
                        y: d.position.y + offset.y,
                        z: d.position.z,
                      }}
                      rotation={d.rotation}
                      scale={d.scale}
                      // transform={transform(
                      //   translate(-215, -300, 0),
                      //   translate(-offset.x, -offset.y, offset.z - perspective),
                      //   rotateX(-rotate),
                      //   translate(215, 300, 0)
                      // )}
                    />
                  ))}

                  {board.decks.map((d) => (
                    <Deck3D
                      key={d.id}
                      id={d.id}
                      image={d.image}
                      orientation={d.orientation}
                      position={{
                        x: d.position.x + offset.x,
                        y: d.position.y + offset.y,
                      }}
                      cards={d.cards}
                    />
                  ))}
                </>
              )}
            </Observer>
          </BoardCamera>
          <PlayerHand player="A" />
          <NextStepButton
            title="Next step"
            onClick={() => {
              console.log('next');
            }}
          />
        </div>
      </div>
    </>
  );
};

export const PlayerHand = (props: { player: PlayerId }) => {
  const { state } = useGameState();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: -100,
        width: '100%',
      }}
    >
      <HandLayout
        cardImages={state.players[props.player]?.zones.hand.cards.map((id) =>
          getCardImageUrl(state.cards[id].definition.front)
        )}
        cardWidth={200}
        rotate={2}
      />
    </div>
  );
};
