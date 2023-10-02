import { Action } from '@card-engine-nx/state';

export function sequence(...actions: Action[]): Action {
  return {
    sequence: actions,
  };
}
