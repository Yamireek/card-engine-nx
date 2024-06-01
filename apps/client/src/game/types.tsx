import { Difficulty } from '@card-engine-nx/basic';
import { decks, core } from '@card-engine-nx/cards';
import { Texture } from 'three';

export type Textures = Record<string, Texture>;
export type NewGameParams = {
  type: 'new';
  server?: 'local' | { url: string };
  playerCount: '1' | '2' | '3' | '4';
  players: Array<keyof typeof decks>;
  scenario: keyof typeof core.scenario;
  difficulty: Difficulty;
  extra: {
    resources: number;
    cards: number;
  };
};

export type LoadGameParams = {
  type: 'load';
  state: string;
};

export type JoinGameParams = {
  type: 'join';
  server: string;
  playerID: string;
  matchID: string;
  credentials: string;
};

export type SetupParams = NewGameParams | LoadGameParams | JoinGameParams;
