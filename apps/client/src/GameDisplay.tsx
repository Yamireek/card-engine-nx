import {
  GameInfo,
  TexturesProvider,
  getCardImageUrls,
  image,
} from '@card-engine-nx/ui';
import { useContext, useMemo } from 'react';
import { StateContext } from './StateContext';
import { UiEvent, UIEvents } from '@card-engine-nx/engine';
import { values } from '@card-engine-nx/basic';
import { Board3d } from './Board3d';
import { State } from '@card-engine-nx/state';
import { uniq } from 'lodash';
import { Subject } from 'rxjs';
import { FloatingCards } from './FloatingCards';
import { GameSceneLoader } from './GameScene';
import { PlayerAreas } from './PlayerAreas';
import { GameAreas } from './GameAreas';
import { CardDetail } from './CardDetail';
import { Paper } from '@mui/material';
import { sum } from 'lodash/fp';
import { GameDialogs } from './GameDialogs';
import { FloatingCardsProvider } from './FloatingCardsContext';

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

function createRxUiEvents(): UIEvents {
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

export const rxEvents = createRxUiEvents();

const playerIds = ['0', '1', '2', '3'] as const;

export const LotrLCGInfo = () => {
  const { state, view, playerId } = useContext(StateContext);

  const totalWillpower = sum(
    values(state.cards)
      .filter((c) => c.mark.questing)
      .map((c) => view.cards[c.id].props.willpower ?? 0)
  );

  const totalThreat = sum(
    state.zones.stagingArea.cards.map((id) => view.cards[id].props.threat ?? 0)
  );

  const currentProgress = sum(
    state.zones.questArea.cards.map((id) => state.cards[id].token.progress)
  );

  const targetProgress = sum(
    state.zones.questArea.cards.map((id) => view.cards[id].props.questPoints)
  );

  return (
    <div
      style={{
        position: 'absolute',
        width: 300,
        padding: 8,
        zIndex: 10,
        right: 0,
      }}
    >
      <GameInfo
        players={values(state.players).map((p) => ({
          id: p.id,
          threat: p.thread,
          state: p.eliminated ? 'eliminated' : 'active',
        }))}
        progress={{ current: currentProgress, target: targetProgress }}
        showPlayer={playerId}
        threat={totalThreat}
        willpower={totalWillpower}
      />
    </div>
  );
};

export const GameDisplay = () => {
  const { state } = useContext(StateContext);
  const textureUrls = useMemo(
    () => [...staticUrls, ...getAllImageUrls(state)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <FloatingCardsProvider>
      <div style={{ width: '100%', height: '100vh' }}>
        <Paper
          style={{
            position: 'absolute',
            width: 300,
            background: 'rgba(255,255,255,0.75)',
            padding: 8,
            zIndex: 10,
          }}
        >
          <CardDetail />
        </Paper>
        <LotrLCGInfo />
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
              <FloatingCards />

              {playerIds.map((id) => (
                <PlayerAreas key={id} player={id} />
              ))}

              <GameAreas playerCount={Object.keys(state.players).length} />
            </GameSceneLoader>
          </TexturesProvider>
        </div>
        {/* <PlayerHand player="A" /> */}
        <GameDialogs />
      </div>
    </FloatingCardsProvider>
  );
};
