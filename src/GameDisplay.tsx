import {
  image,
  NextStepButton,
  getCardImageUrl,
  getCardImageUrls,
} from '@card-engine-nx/ui';
import { useContext, useEffect, useMemo, useState } from 'react';
import { StateContext } from './StateContext';
import {
  UiEvent,
  UIEvents as UiEvents,
} from '@card-engine-nx/engine';
import { CardId, PlayerId, values } from '@card-engine-nx/basic';
import { Board3d } from './Board3d';
import { Card3d, Card3dProps, cardSize } from './Card3d';
import { CardAreaLayout, CardAreaLayoutProps } from './CardAreaLayout';
import { Texture } from 'three';
import { CardState, State } from '@card-engine-nx/state';
import { uniq } from 'lodash';
import * as THREE from 'three';
import { Subject } from 'rxjs';
import { Deck3d } from './Deck3d';
import { Textures } from './types';
import { FloatingCards } from './FloatingCards';
import { PlayerHand } from './PlayerHand';
import { GameSceneLoader } from './GameScene';

export async function preLoadTextures(state: State): Promise<Textures> {
  const urls = uniq(
    values(state.cards).flatMap((c) => {
      const images = getCardImageUrls(c.definition);
      return [images.front, images.back];
    })
  );

  const loader = new THREE.TextureLoader();
  const textures: Record<string, Texture> = {};
  for (const url of urls) {
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

export const PlayerAreas = (props: {
  player: PlayerId;
  textures: Textures;
  hiddenCards: CardId[];
}) => {
  const { state } = useContext(StateContext);
  const playerState = state.players[props.player];

  const cardRenderer: CardAreaLayoutProps<CardState>['renderer'] = (p) => {
    return (
      <Card3d
        key={p.item.id}
        id={p.item.id}
        size={{
          width: p.size.width / 1.2,
          height: p.size.height / 1.2,
        }}
        position={[p.position[0], p.position[1], 0.001]}
        textures={{
          front:
            props.textures[getCardImageUrl(p.item.definition.front, 'front')],
          back: props.textures[getCardImageUrl(p.item.definition.back, 'back')],
        }}
        hidden={props.hiddenCards.includes(p.item.id)}
      />
    );
  };

  if (!playerState) {
    return null;
  }

  return (
    <group>
      <Deck3d
        owner={props.player}
        type="library"
        position={[0.35, -0.4, 0]}
        cardCount={playerState.zones.library.cards.length}
        texture={props.textures[image.playerBack]}
      />
      <Deck3d
        owner={props.player}
        type="discardPile"
        position={[0.45, -0.4, 0]}
        cardCount={playerState.zones.discardPile.cards.length}
        texture={props.textures[image.playerBack]}
      />
      <CardAreaLayout
        color="blue"
        position={[-0.1, -0.4]}
        size={{ width: 0.8, height: 0.2 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={playerState.zones.hand.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
      <CardAreaLayout
        color="green"
        position={[0, -0.15]}
        size={{ width: 1, height: 0.3 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={playerState.zones.playerArea.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
      <CardAreaLayout
        color="red"
        position={[0, 0.1]}
        size={{ width: 1, height: 0.2 }}
        itemSize={{
          width: cardSize.width * 1.2,
          height: cardSize.height * 1.2,
        }}
        items={playerState.zones.engaged.cards.map((id) => state.cards[id])}
        renderer={cardRenderer}
      />
    </group>
  );
};

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
        console.log(e.state.players.A?.zones.hand.cards.length);
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
        <GameSceneLoader angle={20} rotation={0} perspective={3000} debug>
          <Board3d />
          <FloatingCards
            events={events}
            textures={textures}
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

          {/* 
          {state.players.A && (
            <Deck3d
              owner="A"
              type="library"
              position={[0, 0.3, 0]}
              cardCount={state.players.A.zones.library.cards.length}
              texture={textures[image.playerBack]}
            />
          )}

          {state.players.A && (
            <CardAreaLayout
              color="red"
              position={[0, 0]}
              size={{ width: 1, height: 0.5 }}
              itemSize={{
                width: cardSize.width * 1.2,
                height: cardSize.height * 1.2,
              }}
              items={state.players.A?.zones.hand.cards.map(
                (id) => state.cards[id]
              )}
              renderer={(p) => (
                <Card3d
                  key={p.item.id}
                  id={p.item.id}
                  size={{
                    width: p.size.width / 1.2,
                    height: p.size.height / 1.2,
                  }}
                  position={[p.position[0], p.position[1], 0.001]}
                  textures={{
                    front: textures[getCardImageUrl(p.item.definition.front)],
                    back: textures[getCardImageUrl(p.item.definition.back)],
                  }}
                  hidden={floatingCards.some((c) => c.id === p.item.id)}
                />
              )}
            />
          )} */}
        </GameSceneLoader>
        <PlayerHand player="A" />
        <NextStepButton
          title="Next step"
          onClick={() => {
            return;
          }}
        />
      </div>
    </div>
  );
};
