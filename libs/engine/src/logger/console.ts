import { Logger } from './types';

export const consoleLogger: Logger = {
  log(...message: unknown[]): void {
    console.log(...message);
  },

  error(...message: unknown[]): void {
    console.error(...message);
  },
};
