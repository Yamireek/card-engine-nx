export type Logger = {
  log(...message: unknown[]): void;
  error(...message: unknown[]): void;
};
