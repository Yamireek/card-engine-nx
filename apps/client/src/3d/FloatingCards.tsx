import { useThree } from '@react-three/fiber';
import { uniqBy } from 'lodash';
import { useEffect } from 'react';
import { getZoneIdString } from '@card-engine-nx/basic';
import { getCardImageUrl, useTextures } from '@card-engine-nx/ui';
import { useGameState } from '../game/StateContext';
import { Card3d } from './Card3d';
import { useFloatingCards } from './FloatingCardsContext';
import { rxEvents } from './GameDisplay';

export const FloatingCards = () => {
  const { floatingCards: cards, setFloatingCards: setCards } =
    useFloatingCards();
  const { ctx } = useGameState();
  const state = ctx.state;
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
          const position = deckMesh.getWorldPosition(deckMesh.position.clone());
          setCards((p) => [
            ...p,
            {
              id: e.cardId,
              name: `floating-card-${e.cardId}`,
              position: [position.x, position.y, position.z],
              rotation: [-Math.PI / 2, Math.PI, 0],
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
                      position: [position.x, 0.1, position.z],
                    }
                  : { ...c }
              )
            );
          }, 500);

          setTimeout(() => {
            setCards((p) =>
              p.map((c) =>
                c.id === e.cardId
                  ? { ...c, rotation: [-Math.PI / 2, 0, 0] }
                  : { ...c }
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
                        rotation: [-Math.PI / 2, 0, 0],
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
              rotation: [-Math.PI / 2, 0, 0],
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
                        rotation: [-Math.PI / 2, 0, 0],
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
                        rotation: [-Math.PI / 2, 0, 0],
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
