import { NextStepButton, getCardImageUrls, image } from '@card-engine-nx/ui';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StateContext } from './StateContext';
import {
  UiEvent,
  UIEvents as UiEvents,
  advanceToChoiceState,
} from '@card-engine-nx/engine';
import { values } from '@card-engine-nx/basic';
import { Board3d } from './Board3d';
import { Card3dProps } from './Card3d';
import { Texture } from 'three';
import { State } from '@card-engine-nx/state';
import { uniq } from 'lodash';
import * as THREE from 'three';
import { Subject } from 'rxjs';
import { Textures } from './types';
import { FloatingCards } from './FloatingCards';
import { PlayerHand } from './PlayerHand';
import { GameSceneLoader } from './GameScene';
import { PlayerAreas } from './PlayerAreas';
import { GameAreas } from './GameAreas';

const staticUrls = [image.progress, image.resource, image.damage];

export async function preLoadTextures(state: State): Promise<Textures> {
  const cardUrls = uniq(
    values(state.cards).flatMap((c) => {
      const images = getCardImageUrls(c.definition);
      return [images.front, images.back];
    })
  );

  const loader = new THREE.TextureLoader();
  const textures: Record<string, Texture> = {};
  for (const url of [...staticUrls, ...cardUrls]) {
    console.log('loading texture', url);
    textures[url] = await loader.loadAsync(url);
  }
  return textures;
}

export function createRxUiEvents(): UiEvents {
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
  const { state, setState } = useContext(StateContext);
  const [floatingCards, setFloatingCards] = useState<Card3dProps[]>([]);
  const [textures, setTextures] = useState<Textures | undefined>();

  useEffect(() => {
    preLoadTextures(state)
      .then(setTextures)
      .catch((e) => {
        console.log(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const events = useMemo<UiEvents>(() => {
    const tmp = createRxUiEvents();
    tmp.subscribe((e) => {
      if (e.type === 'new_state') {
        setState({ ...e.state });
      }
    });
    return tmp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!textures) {
    return <div>loading textures...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <GameSceneLoader angle={20} rotation={0} perspective={3000}>
          <Board3d />
          <FloatingCards
            events={events}
            textures={textures}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cards={[floatingCards, setFloatingCards] as any}
          />

          {playerIds.map((id) => (
            <PlayerAreas
              key={id}
              player={id}
              textures={textures}
              hiddenCards={floatingCards.map((c) => c.id)}
            />
          ))}

          <GameAreas
            playerCount={Object.keys(state.players).length}
            textures={textures}
            hiddenCards={floatingCards.map((c) => c.id)}
          />
        </GameSceneLoader>
        {/* <PlayerHand player="A" /> */}
        {!state.choice?.dialog && (
          <NextStepButton
            title={state.choice?.title ?? 'Next'}
            onClick={() => {
              state.choice = undefined;
              advanceToChoiceState(state, events);
            }}
          />
        )}
      </div>
    </div>
  );
};
