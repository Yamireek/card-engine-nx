import { Logger } from './types';

export const nullLogger: Logger = {
  log(): void {
    return;
  },

  error(): void {
    return;
  },
};
