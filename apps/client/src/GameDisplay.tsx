import {
  GameInfo,
  TexturesProvider,
  getCardImageUrls,
  image,
} from '@card-engine-nx/ui';
import React, { useContext, useMemo, useState } from 'react';
import { StateContext } from './StateContext';
import {
  calculateNumberExpr,
  getModifierText,
  UiEvent,
  UIEvents,
} from '@card-engine-nx/engine';
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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Icon,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { sum } from 'lodash/fp';
import { GameDialogs } from './GameDialogs';
import { FloatingCardsProvider } from './FloatingCardsContext';
import Editor from '@monaco-editor/react';
import { PlayerHand } from './PlayerHand';

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

export const ActionEditorButton = () => {
  const { moves } = useContext(StateContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    JSON.stringify(
      {
        placeProgress: 10,
      },
      null,
      1
    )
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Editor
            height="30vh"
            language="JSON"
            value={value}
            onChange={(v) => setValue(v ?? '')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              moves.json(JSON.parse(value));
            }}
          >
            Execute
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
      >
        <Icon>code</Icon>
      </IconButton>
    </>
  );
};

export const LotrLCGInfo = () => {
  const { state, view, playerId, moves, undo, redo } = useContext(StateContext);

  const totalWillpower = sum(
    values(state.cards)
      .filter((c) => c.mark.questing)
      .map((c) => view.cards[c.id].props.willpower ?? 0)
  );

  const totalThreat = calculateNumberExpr('totalThreat', {
    state,
    view,
    card: {},
    player: {},
  });

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
        width: 372,
        margin: 4,
        zIndex: 10,
        right: 0,
        height: '100%',
        paddingBottom: 80,
        pointerEvents: 'none',
      }}
    >
      <Stack direction="column" spacing={1} height="100%">
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
        <Paper>
          <Stack direction="row" style={{ pointerEvents: 'auto' }}>
            <IconButton
              onClick={() => {
                localStorage.setItem('saved_state', JSON.stringify(state));
              }}
            >
              <Icon>save</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                const value = localStorage.getItem('saved_state');
                if (!value) {
                  return;
                }
                try {
                  const loaded = JSON.parse(value);
                  moves.load(loaded);
                } catch (error) {
                  if (error instanceof Error) {
                    console.log(error.message);
                  }
                }
              }}
            >
              <Icon>upload</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                localStorage.removeItem('saved_state');
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                console.log('state', state);
                console.log('view', view);
              }}
            >
              <Icon>bug_report</Icon>
            </IconButton>

            <IconButton
              onClick={() => {
                undo();
              }}
            >
              <Icon>undo</Icon>
            </IconButton>

            <IconButton
              onClick={() => {
                redo();
              }}
            >
              <Icon>redo</Icon>
            </IconButton>
          </Stack>
        </Paper>
        {state.modifiers.length > 0 && (
          <Paper
            style={{ padding: 4, overflow: 'auto', pointerEvents: 'auto' }}
          >
            <Typography variant="caption">Temporary effects</Typography>
            {state.modifiers.map((m, i) => {
              const title = view.cards[m.source].props.name ?? '';
              return (
                <React.Fragment key={title + i}>
                  <Tooltip title={title} placement="left">
                    <Typography>{getModifierText(m, state, view)}</Typography>
                  </Tooltip>
                  <Divider variant="fullWidth" />
                </React.Fragment>
              );
            })}
          </Paper>
        )}
        <Paper style={{ padding: 4, overflow: 'auto', pointerEvents: 'auto' }}>
          <Typography variant="caption">Possible actions</Typography>
          {view.actions
            .filter((a) => a.enabled)
            .map((a, i) => {
              const title = view.cards[a.card].props.name ?? '';
              return (
                <React.Fragment key={title + i}>
                  <Tooltip title={title} placement="left">
                    <Typography>{a.description}</Typography>
                  </Tooltip>
                  <Divider variant="fullWidth" />
                </React.Fragment>
              );
            })}
        </Paper>
      </Stack>
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
        <PlayerHand player="0" />
        <GameDialogs />
      </div>
    </FloatingCardsProvider>
  );
};
