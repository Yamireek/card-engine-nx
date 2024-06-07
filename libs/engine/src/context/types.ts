import { State, Action } from '@card-engine-nx/state';

export type SkipOptions = { show: boolean; actions: boolean };

export type IExeCtx = {
  state: State;
  next: (...action: Action[]) => void;
};

export type IViewCtx = {
  state: State;
};
