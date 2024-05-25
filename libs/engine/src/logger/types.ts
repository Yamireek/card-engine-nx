export type Logger = {
  debug(...message: unknown[]): void;
  log(message: string): void;
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
};
