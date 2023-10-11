import {
  ChooseDistributionDialog,
  ChooseMultiDialog,
  ChooseSingleDialog,
  NextStepButton,
  getCardImageUrl,
} from '@card-engine-nx/ui';
import { useContext } from 'react';
import { StateContext } from './StateContext';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export const GameDialogs = () => {
  const { state, view, moves, playerId } = useContext(StateContext);

  if (state.result) {
    if (state.result.win) {
      return (
        <Dialog open>
          <DialogTitle>Game won with score {state.result.score}</DialogTitle>
        </Dialog>
      );
    } else {
      return (
        <Dialog open>
          <DialogTitle>Game lost</DialogTitle>
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
    return (
      <Dialog
        open
        onClose={() => {
          moves.skip();
        }}
      >
        <DialogTitle>{state.choice.title}</DialogTitle>
        <DialogContent>
          <img
            alt=""
            src={getCardImageUrl(
              view.cards[state.choice.cardId].props,
              state.cards[state.choice.cardId].sideUp
            )}
            style={{
              width: 430,
              height: 600,
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
            width: 430 / 3,
            height: 600 / 3,
          },
        }))}
        onSubmit={(ids) => moves.choose(...ids)}
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
            width: 430 / 3,
            height: 600 / 3,
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
        total={{ min: state.choice.amount, max: state.choice.amount }}
        choices={state.choice.options.map((o, i) => ({
          id: i,
          title: o.title,
          image: {
            src: getCardImageUrl(
              view.cards[o.cardId].props,
              state.cards[o.cardId].sideUp
            ),
            width: 430 / 3,
            height: 600 / 3,
          },
          min: o.min,
          max: o.max,
        }))}
        onSubmit={(amounts) => {
          moves.split(...amounts);
        }}
      />
    );
  }

  return null;
};
