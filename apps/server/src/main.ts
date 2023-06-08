// src/server.js
import { Server, Origins } from 'boardgame.io/server';
import { LotrLCGame, consoleEvents } from '@card-engine-nx/engine';

const server = Server({
  games: [LotrLCGame(consoleEvents)],
  origins: [Origins.LOCALHOST],
});

server.run({
  port: 3000,
});
