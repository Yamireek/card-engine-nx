import { Logger } from './types';

export const consoleLogger: Logger = {
  debug(...message) {
    console.log(...message);
  },
  log(...message: unknown[]): void {
    console.log(...message);
  },
  success(message) {
    console.log(message);
  },
  warning(message) {
    console.log(message);
  },
  error(...message: unknown[]): void {
    console.error(...message);
  },
};
