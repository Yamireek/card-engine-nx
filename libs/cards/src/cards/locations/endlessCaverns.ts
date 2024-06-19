import { location } from '@card-engine-nx/state';

export const endlessCaverns = location({
  name: 'Endless Caverns',
  threat: 1,
  questPoints: 3,
  traits: ['dungeon'],
  keywords: {
    doomed: 1,
    surge: 1,
  },
});
