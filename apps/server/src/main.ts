// src/server.js
import { Server, Origins } from 'boardgame.io/server';
import { LotrLCGame } from '@card-engine-nx/engine';

const server = Server({
  games: [LotrLCGame],
  origins: [Origins.LOCALHOST],
});

server.run({
  port: 3000,
});
