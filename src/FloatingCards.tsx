import { getCardImageUrl } from '@card-engine-nx/ui';
import { useEffect } from 'react';
import { useGameState } from './StateContext';
import { UIEvents as UiEvents } from '@card-engine-nx/engine';
import { Card3d, Card3dProps } from './Card3d';
import { useThree } from '@react-three/fiber';
import { Textures } from './types';

export const FloatingCards = (props: {
  events: UiEvents;
  textures: Textures;
  cards: [Card3dProps[], (v: (p: Card3dProps[]) => Card3dProps[]) => void];
}) => {
  const [floatingCards, setFloatingCards] = props.cards;
  const { state } = useGameState();
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const unsub = props.events.subscribe((e) => {
      if (e.type === 'card_moved') {
        const card = state.cards[e.cardId];

        const deckMesh = scene.getObjectByName(
          `deck-${e.source.owner}-${e.source.type}`
        );

        const cardMesh = scene.getObjectByName(`card-${e.cardId}`);

        if (deckMesh && !cardMesh) {
          setFloatingCards((p) => [
            ...p,
            {
              id: e.cardId,
              name: `floating-card-${e.cardId}`,
              position: [
                deckMesh.position.x,
                deckMesh.position.y,
                deckMesh.position.z,
              ],
              rotation: [0, Math.PI, 0],
              textures: {
                front:
                  props.textures[
                    getCardImageUrl(card.definition.front, 'front')
                  ],
                back: props.textures[
                  getCardImageUrl(card.definition.back, 'back')
                ],
              },
            },
          ]);

          setTimeout(() => {
            setFloatingCards((p) =>
              p.map((c) =>
                c.id === e.cardId
                  ? {
                      ...c,
                      position: [deckMesh.position.x, deckMesh.position.y, 0.1],
                    }
                  : { ...c }
              )
            );
          }, 500);

          setTimeout(() => {
            setFloatingCards((p) =>
              p.map((c) =>
                c.id === e.cardId ? { ...c, rotation: [0, 0, 0] } : { ...c }
              )
            );
          }, 1000);

          setTimeout(() => {
            const cardMesh = scene.getObjectByName('card-' + e.cardId);

            if (cardMesh) {
              const position = cardMesh.getWorldPosition(
                cardMesh.position.clone()
              );

              setFloatingCards((p) =>
                p.map((c) =>
                  c.id === e.cardId && cardMesh.parent
                    ? {
                        ...c,
                        position: [position.x, position.y, position.z],
                        scale: cardMesh.scale.x,
                      }
                    : { ...c }
                )
              );
            }
          }, 2000);

          setTimeout(() => {
            setFloatingCards((p) => p.filter((c) => c.id !== e.cardId));
          }, 2500);
        }

        if (cardMesh && !deckMesh) {
          const matrix = cardMesh.matrixWorld;
          const scale = matrix.elements[0];
          const x = matrix.elements[12];
          const y = matrix.elements[13];
          const z = matrix.elements[14];
          setFloatingCards((p) => [
            ...p,
            {
              id: e.cardId,
              name: `floating-card-${e.cardId}`,
              position: [x, y, z],
              scale,
              textures: {
                front:
                  props.textures[
                    getCardImageUrl(card.definition.front, 'front')
                  ],
                back: props.textures[
                  getCardImageUrl(card.definition.back, 'back')
                ],
              },
            },
          ]);

          setTimeout(() => {
            const newCardMesh = scene.getObjectByName('card-' + e.cardId);
            if (newCardMesh) {
              const position = newCardMesh.getWorldPosition(
                newCardMesh.position.clone()
              );

              setFloatingCards((p) =>
                p.map((c) =>
                  c.id === e.cardId && newCardMesh.parent
                    ? {
                        ...c,
                        position: [position.x, position.y, position.z],
                        scale: newCardMesh.scale.x,
                      }
                    : { ...c }
                )
              );
            }
          }, 1);

          setTimeout(() => {
            setFloatingCards((p) => p.filter((c) => c.id !== e.cardId));
          }, 500);
        }

        return;
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {floatingCards.map((p) => (
        <Card3d {...p} key={p.id} />
      ))}
    </>
  );
};
