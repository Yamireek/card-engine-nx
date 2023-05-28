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
import { useContext, useEffect, useMemo, useState } from 'react';
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
import { PlayerId, values } from '@card-engine-nx/basic';
import { GameSceneLoader } from './ThreeJsTest';
import { Board3d } from './Board3d';
import { Card3d } from './Card3d';
import { CardAreaLayout } from './CardAreaLayout';
import { Texture } from 'three';
import { State } from '@card-engine-nx/state';
import { uniq } from 'lodash';
import * as THREE from 'three';

const boardSize = { width: 1608 * 4, height: 1620 * 4 };
const offset = { x: -boardSize.width / 2, y: -boardSize.height / 2 };

export type Textures = Record<string, Texture>;

export async function preLoadTextures(state: State): Promise<Textures> {
  const urls = uniq(
    values(state.cards).flatMap((c) => [
      getCardImageUrl(c.definition.front),
      getCardImageUrl(c.definition.back),
    ])
  );

  const loader = new THREE.TextureLoader();
  const textures: Record<string, Texture> = {};
  for (const url of urls) {
    console.log('loading texture', url);
    textures[url] = await loader.loadAsync(url);
  }
  return textures;
}

export const GameDisplay = () => {
  const { state, setState } = useContext(StateContext);

  const [textures, setTextures] = useState<Textures | undefined>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    preLoadTextures(state).then(setTextures);
  }, []);

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

  if (!textures) {
    return <div>loading textures...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <GameSceneLoader angle={20} rotation={0} perspective={3000} debug>
          <Board3d />
          <Observer>
            {() => (
              <>
                {/* {board.zones.map((z) => (
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
                  ))} */}

                <CardAreaLayout
                  color="red"
                  position={[0, 0]}
                  size={{ width: 1, height: 0.5 }}
                  itemSize={{
                    width: cardSize.width * 1.2,
                    height: cardSize.height * 1.2,
                  }}
                  items={board.allCards.filter(
                    (c) => c.images.front && c.images.back
                  )}
                  renderer={(p) => (
                    <Card3d
                      key={p.item.id}
                      size={{
                        width: p.size.width / 1.2,
                        height: p.size.height / 1.2,
                      }}
                      position={[p.position[0], p.position[1], 0.001]}
                      textures={{
                        front: textures[p.item.images.front],
                        back: textures[p.item.images.back],
                      }}
                    />
                  )}
                />

                {/* {board.decks.map((d) => (
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
                  ))} */}
              </>
            )}
          </Observer>
        </GameSceneLoader>
        <PlayerHand player="A" />
        <NextStepButton
          title="Next step"
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
        />
      </div>
    </div>
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
