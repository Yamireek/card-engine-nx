import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useContext, useState } from 'react';
import {
  ChooseDistributionDialog,
  ChooseMultiDialog,
  ChooseSingleDialog,
  NextStepButton,
  getCardImageUrl,
  MinimizeDialogButton,
} from '@card-engine-nx/ui';
import { StateContext } from './StateContext';

export const GameDialogs = () => {
  const { state, view, moves, playerId, leave } = useContext(StateContext);
  const [mini, setMini] = useState(false);

  if (mini) {
    return (
      <NextStepButton
        title="Show dialog"
        onClick={() => {
          setMini(false);
        }}
      />
    );
  }

  if (state.result) {
    if (state.result.win) {
      return (
        <Dialog open fullWidth maxWidth="xs">
          <DialogTitle>Game won with score {state.result.score}</DialogTitle>{' '}
          <MinimizeDialogButton
            onMinimize={
              state.phase !== 'setup' ? () => setMini(true) : undefined
            }
          />
          <DialogActions>
            <Button variant="contained" onClick={leave}>
              Leave game
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return (
        <Dialog open fullWidth maxWidth="xs">
          <DialogTitle>Game lost</DialogTitle>
          <MinimizeDialogButton
            onMinimize={
              state.phase !== 'setup' ? () => setMini(true) : undefined
            }
          />
          <DialogActions>
            <Button variant="contained" onClick={leave}>
              Leave game
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }

  if (!state.choice) {
    return null;
  }

  if (state.choice.type === 'actions') {
    return (
      <NextStepButton
        title={state.choice?.title ?? 'Next'}
        onClick={() => {
          moves.skip();
        }}
      />
    );
  }

  if (state.choice.type === 'show') {
    const cardState = state.cards[state.choice.cardId];
    return (
      <Dialog
        open
        onClose={() => {
          moves.skip();
        }}
        maxWidth="md"
      >
        <DialogTitle>{state.choice.title}</DialogTitle>
        <MinimizeDialogButton
          onMinimize={state.phase !== 'setup' ? () => setMini(true) : undefined}
        />
        <DialogContent>
          <img
            alt=""
            src={getCardImageUrl(
              view.cards[state.choice.cardId].props,
              cardState.sideUp,
              cardState.definition.front.name
            )}
            style={{
              width:
                cardState.definition.orientation === 'portrait' ? 430 : 600,
              height:
                cardState.definition.orientation === 'portrait' ? 600 : 430,
            }}
            onClick={() => {
              moves.skip();
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (playerId && state.choice.player !== playerId) {
    return (
      <Dialog open>
        <MinimizeDialogButton onMinimize={() => setMini(true)} />
        <DialogTitle>Waiting for player {state.choice.player}</DialogTitle>
      </Dialog>
    );
  }

  if (state.choice.type === 'multi') {
    return (
      <ChooseMultiDialog
        key={state.choice.id.toString()}
        title={state.choice.title}
        choices={state.choice.options.map((o, i) => ({
          id: i,
          title: o.title,
          action: () => {
            moves.choose(i);
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
        onSubmit={(ids) => moves.choose(...ids)}
        onMinimize={() => setMini(true)}
      />
    );
  }

  if (state.choice.type === 'single') {
    return (
      <ChooseSingleDialog
        key={state.choice.id.toString()}
        title={state.choice.title}
        skippable={state.choice.optional}
        onSkip={() => moves.skip()}
        onMinimize={state.phase !== 'setup' ? () => setMini(true) : undefined}
        choices={state.choice.options.map((o, i) => ({
          title: o.title,
          action: () => {
            moves.choose(i);
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
    );
  }

  if (state.choice.type === 'split') {
    return (
      <ChooseDistributionDialog
        key={state.choice.id.toString()}
        title={state.choice.title}
        total={{ min: state.choice.min, max: state.choice.max }}
        choices={state.choice.options.map((o, i) => ({
          id: i,
          title: o.title,
          image: {
            src: getCardImageUrl(
              view.cards[o.cardId].props,
              state.cards[o.cardId].sideUp
            ),
            width: 430 / 2,
            height: 600 / 2,
          },
          min: o.min,
          max: o.max,
        }))}
        onSubmit={(amounts) => {
          moves.split(...amounts);
        }}
        onMinimize={() => setMini(true)}
      />
    );
  }

  if (state.choice.type === 'X') {
    return (
      <ChooseDistributionDialog
        key={state.choice.id.toString()}
        title="Choose X"
        total={{ min: state.choice.min, max: state.choice.max }}
        choices={[
          {
            id: 0,
            min: state.choice.min,
            max: state.choice.max,
            title: 'X',
          },
        ]}
        onSubmit={(amounts) => {
          moves.split(...amounts);
        }}
        onMinimize={() => setMini(true)}
      />
    );
  }

  return null;
};
