import { location } from '@card-engine-nx/state';

export const towerGate = location({
  name: 'Tower Gate',
  threat: 2,
  questPoints: 1,
  traits: ['dungeon'],
  // Forced: After travelling to Tower Gate each player places the top card of his deck,
  // face down in front of him, as if it just engaged him from the staging area. These cards are called
  // 'Orc Guard', and act as enemies with: 1 hit point, 1 Attack and 1 Defense
});
