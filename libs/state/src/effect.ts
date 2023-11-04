import { Action } from './action';

export type PendingEffect =
  | {
      type: 'whenRevealed';
      description: string;
      whenRevealed: Action;
      canceled?: true;
    }
  | {
      type: 'shadow';
      description: string;
      shadow: Action;
      canceled?: boolean;
    };
