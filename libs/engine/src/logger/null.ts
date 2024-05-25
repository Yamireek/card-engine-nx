import { Logger } from './types';

export const nullLogger: Logger = {
  debug(): void {
    return;
  },
  log(): void {
    return;
  },
  success(): void {
    return;
  },
  warning(): void {
    return;
  },
  error(): void {
    return;
  },
};
