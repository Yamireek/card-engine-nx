// src/server.js
import { Server, Origins } from 'boardgame.io/server';
import { LotrLCGame, emptyEvents } from '@card-engine-nx/engine';

const server = Server({
  games: [LotrLCGame(emptyEvents)],
  origins: [
    'https://card-engine-client.onrender.com',
    'http://192.168.0.101:4200',
    Origins.LOCALHOST,
  ],
});

server.run({
  port: 3000,
});
