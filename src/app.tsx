import { Board, createBoardModel, getCardImageUrl } from '@card-engine-nx/ui';
import { CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import { GameEngine } from './tests/GameEngine';
import { coreTactics } from './decks/coreTactics';
import { addCard } from './tests/addPlayer';
import { executeAction } from '@card-engine-nx/engine';
import {
  CardModel,
  DeckModel,
  FloatingCardModel,
  ZoneModel,
  cardSize,
} from '@card-engine-nx/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawerWidth = 430;

export const App = () => {
  const result = useMemo(() => {
    const engine = new GameEngine();
    engine.addPlayer();

    for (const hero of coreTactics.heroes) {
      engine.addHero(hero);
    }

    for (const card of coreTactics.library) {
      addCard(card, 'back', { type: 'library', owner: 'A' }).execute(
        engine.state
      );
    }

    return { board: createBoardModel(engine.state), engine };
  }, []);

  const board = result.board;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <CssBaseline />

      <button
        onClick={() => {
          executeAction(
            { shuffle: { zone: { owner: 'A', type: 'library' } } },
            result.engine.state,
            {}
          );

          executeAction(
            { player: { action: { draw: 7 }, target: 'each' } },
            result.engine.state,
            {
              onCardMoved(cardId, source, destination, side) {
                const cardState = result.engine.state.cards[cardId];

                board.update(() => {
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
                });

                setTimeout(() => {
                  board.update(() => {
                    const card = board.cards.find(
                      (c) => c.id === cardId.toString()
                    );
                    if (card) {
                      card.position = {
                        ...card.position,
                        z: card.position.z + cardSize.width / 2,
                      };
                    }
                  });
                }, 0);

                setTimeout(() => {
                  board.update(() => {
                    const card = board.cards.find(
                      (c) => c.id === cardId.toString()
                    );
                    if (card) {
                      card.rotation = { x: 0, y: 0, z: 0 };
                    }
                  });
                }, 500);

                setTimeout(() => {
                  board.update(() => {
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
                  });
                }, 1000);
              },
            }
          );
        }}
      >
        draw
      </button>

      <Board
        perspective={1000}
        rotate={0}
        width={1608 * 3}
        height={1620 * 3}
        model={result.board}
      />

      {/* <div style={{ position: 'absolute', top: 0 }}>
        <CardDisplay
          height={600}
          image={cardImages[0]}
          orientation="portrait"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -100,
          width: '100%',
        }}
      >
        <HandLayout cardImages={cardImages} cardWidth={200} rotate={2} />
      </div>

      */}
      {/* <NextStepButton
        title="Next step"
        onClick={() => {
          console.log('next');
        }}
      /> */}
    </div>
  );
};
