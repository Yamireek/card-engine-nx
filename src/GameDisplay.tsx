import {
  ChooseSingleDialog,
  NextStepButton,
  TexturesProvider,
  getCardImageUrl,
  getCardImageUrls,
  image,
} from '@card-engine-nx/ui';
import { useContext, useMemo, useState } from 'react';
import { StateContext } from './StateContext';
import { UiEvent, UIEvents } from '@card-engine-nx/engine';
import { values } from '@card-engine-nx/basic';
import { Board3d } from './Board3d';
import { Card3dProps } from './Card3d';
import { State } from '@card-engine-nx/state';
import { uniq } from 'lodash';
import { Subject } from 'rxjs';
import { FloatingCards } from './FloatingCards';
import { GameSceneLoader } from './GameScene';
import { PlayerAreas } from './PlayerAreas';
import { GameAreas } from './GameAreas';
import { CardDetail } from './CardDetail';

const staticUrls = [image.progress, image.resource, image.damage];

export function getAllImageUrls(state: State): string[] {
  const cardUrls = uniq(
    values(state.cards).flatMap((c) => {
      const images = getCardImageUrls(c.definition);
      return [images.front, images.back];
    })
  );

  return cardUrls;
}

export function createRxUiEvents(): UIEvents {
  const s = new Subject<UiEvent>();
  return {
    send(event) {
      s.next(event);
    },
    subscribe(sub) {
      const subscription = s.subscribe((e) => sub(e));
      return () => subscription.unsubscribe();
    },
  };
}

const playerIds = ['A', 'B', 'C', 'D'] as const;

export const GameDisplay = () => {
  const { state, view, moves, events } = useContext(StateContext);
  const [floatingCards, setFloatingCards] = useState<Card3dProps[]>([]);
  const textureUrls = useMemo(
    () => [...staticUrls, ...getAllImageUrls(state)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          width: 300,
          border: '1px solid black',
          background: 'rgba(255,255,255,0.75)',
          padding: 8,
          zIndex: 10,
        }}
      >
        <CardDetail />
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <TexturesProvider
          textures={textureUrls}
          materials={{
            wood: {
              color: './textures/wood-2k/Wood026_2K_Color.png',
              roughness: './textures/wood-2k/Wood026_2K_Roughness.png',
              normal: './textures/wood-2k/Wood026_2K_NormalGL.png',
            },
          }}
        >
          <GameSceneLoader angle={20} rotation={0} perspective={1500}>
            <Board3d />
            <FloatingCards
              events={events}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cards={[floatingCards, setFloatingCards] as any}
            />

            {playerIds.map((id) => (
              <PlayerAreas
                key={id}
                player={id}
                hiddenCards={floatingCards.map((c) => c.id)}
                events={events}
              />
            ))}

            <GameAreas
              playerCount={Object.keys(state.players).length}
              hiddenCards={floatingCards.map((c) => c.id)}
            />
          </GameSceneLoader>
        </TexturesProvider>
      </div>
      {/* <PlayerHand player="A" /> */}
      {state.choice?.dialog && !state.choice.multi && (
        <ChooseSingleDialog
          key={state.choice.id}
          title={state.choice.title}
          choices={state.choice.options.map((o, i) => ({
            title: o.title,
            action: () => {
              moves.choose([i]);
            },
            image: o.cardId && {
              src: getCardImageUrl(
                view.cards[o.cardId].props,
                state.cards[o.cardId].sideUp
              ),
              width: 430 / 2,
              height: 600 / 2,
            },
          }))}
        />
      )}
      {!state.choice?.dialog && (
        <NextStepButton
          title={state.choice?.title ?? 'Next'}
          onClick={() => {
            moves.skip();
          }}
        />
      )}
    </div>
  );
};
