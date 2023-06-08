import {
  ChooseMultiDialog,
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
import { coreTactics } from './decks/coreTactics';
import { core } from '@card-engine-nx/cards';
import { Dialog, DialogTitle } from '@mui/material';
import { DetailProvider } from './DetailContext';

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

export const rxEvents = createRxUiEvents();

const playerIds = ['0', '1', '2', '3'] as const;

export const GameSetup = () => {
  const { state, moves, playerId } = useContext(StateContext);

  if (state.phase !== 'setup') {
    return (
      <DetailProvider>
        <GameDisplay />
      </DetailProvider>
    );
  }

  const waitingPlayers = values(state.players)
    .filter((p) => p.zones.library.cards.length === 0)
    .map((p) => p.id);

  if (waitingPlayers.length > 0) {
    if (waitingPlayers.includes(playerId)) {
      return (
        <button
          onClick={() => {
            moves.selectDeck(coreTactics);
          }}
        >
          Choose deck "Core Tactics"
        </button>
      );
    } else {
      return <>Waiting for others to select deck: {waitingPlayers}</>;
    }
  }

  if (state.zones.questDeck.cards.length === 0) {
    return (
      <button
        onClick={() => {
          moves.selectScenario(core.scenario.passageThroughMirkwood);
        }}
      >
        Choose scenario "Passage Through Mirkwood"
      </button>
    );
  }

  return null;
};

export const GameDisplay = () => {
  const { state, view, moves, events, playerId } = useContext(StateContext);
  const [floatingCards, setFloatingCards] = useState<Card3dProps[]>([]);
  const textureUrls = useMemo(
    () => [...staticUrls, ...getAllImageUrls(state)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div style={{ width: '100%', height: '100vh' }}>
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
      {state.choice?.dialog && state.choice.player !== playerId && (
        <Dialog open>
          <DialogTitle>Waiting for player {state.choice.player}</DialogTitle>
        </Dialog>
      )}
      {state.choice?.dialog &&
        !state.choice.multi &&
        state.choice.player === playerId && (
          <ChooseSingleDialog
            key={state.choice.id.toString()}
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
                width: 430 / 3,
                height: 600 / 3,
              },
            }))}
          />
        )}

      {state.choice?.dialog &&
        state.choice.multi &&
        state.choice.player === playerId && (
          <ChooseMultiDialog
            key={state.choice.id.toString()}
            title={state.choice.title}
            choices={state.choice.options.map((o, i) => ({
              id: i,
              title: o.title,
              action: () => {
                moves.choose([i]);
              },
              image: o.cardId && {
                src: getCardImageUrl(
                  view.cards[o.cardId].props,
                  state.cards[o.cardId].sideUp
                ),
                width: 430 / 3,
                height: 600 / 3,
              },
            }))}
            onSubmit={(ids) => moves.choose(ids)}
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
