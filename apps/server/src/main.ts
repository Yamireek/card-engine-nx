// src/server.js
import { Server, Origins } from 'boardgame.io/server';
import { LotrLCGame, consoleEvents } from '@card-engine-nx/engine';

const server = Server({
  games: [LotrLCGame(consoleEvents)],
  origins: ['http://192.168.0.101:4200', Origins.LOCALHOST],
});

server.run({
  port: 3000,
});
