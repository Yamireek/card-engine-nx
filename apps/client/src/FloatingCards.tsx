import { getCardImageUrl, useTextures } from '@card-engine-nx/ui';
import { useEffect } from 'react';
import { useGameState } from './StateContext';
import { Card3d } from './Card3d';
import { useThree } from '@react-three/fiber';
import { rxEvents } from './GameDisplay';
import { uniqBy } from 'lodash';
import { useFloatingCards } from './FloatingCardsContext';
import { getZoneIdString } from '@card-engine-nx/basic';

export const FloatingCards = () => {
  const { floatingCards: cards, setFloatingCards: setCards } =
    useFloatingCards();
  const { state } = useGameState();
  const scene = useThree((s) => s.scene);
  const { texture } = useTextures();

  useEffect(() => {
    const unsub = rxEvents.subscribe((e) => {
      if (e.type === 'card_moved') {
        const card = state.cards[e.cardId];

        const deckMesh = scene.getObjectByName(
          `deck-${getZoneIdString(e.source)}`
        );

        const cardMesh = scene.getObjectByName(`card-${e.cardId}`);

        const targetDeckName = `deck-${getZoneIdString(e.destination)}`;

        if (deckMesh && !cardMesh) {
          setCards((p) => [
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
              texture: {
                front: texture[getCardImageUrl(card.definition.front, 'front')],
                back: texture[getCardImageUrl(card.definition.back, 'back')],
              },
            },
          ]);

          setTimeout(() => {
            setCards((p) =>
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
            setCards((p) =>
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

              setCards((p) =>
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
            setCards((p) => p.filter((c) => c.id !== e.cardId));
          }, 2500);
        }

        if (cardMesh && !deckMesh) {
          const matrix = cardMesh.matrixWorld;
          const scale = matrix.elements[0];
          const x = matrix.elements[12];
          const y = matrix.elements[13];
          const z = matrix.elements[14];
          setCards((p) => [
            ...p,
            {
              id: e.cardId,
              name: `floating-card-${e.cardId}`,
              position: [x, y, z],
              scale,
              texture: {
                front: texture[getCardImageUrl(card.definition.front, 'front')],
                back: texture[getCardImageUrl(card.definition.back, 'back')],
              },
            },
          ]);

          setTimeout(() => {
            const newCardMesh = scene.getObjectByName('card-' + e.cardId);
            const newDeckMesh = scene.getObjectByName(targetDeckName);

            if (newCardMesh && !newDeckMesh) {
              const position = newCardMesh.getWorldPosition(
                newCardMesh.position.clone()
              );

              setCards((p) =>
                p.map((c) =>
                  c.id === e.cardId
                    ? {
                        ...c,
                        position: [position.x, position.y, position.z],
                        scale: newCardMesh.scale.x,
                      }
                    : { ...c }
                )
              );
            }

            if (newDeckMesh && !newCardMesh) {
              const position = newDeckMesh.getWorldPosition(
                newDeckMesh.position.clone()
              );

              setCards((p) =>
                p.map((c) =>
                  c.id === e.cardId
                    ? {
                        ...c,
                        position: [position.x, position.y, position.z],
                        scale: 1,
                      }
                    : { ...c }
                )
              );
            }
          }, 1);

          setTimeout(() => {
            setCards((p) => p.filter((c) => c.id !== e.cardId));
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
      {uniqBy(cards, (c) => c.id).map((p) => (
        <Card3d {...p} key={p.id} />
      ))}
    </>
  );
};
