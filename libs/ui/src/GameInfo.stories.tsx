import { GameInfo } from './GameInfo';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof GameInfo> = {
  component: GameInfo,
  title: 'GameInfo',
  args: {
    showPlayer: '0',
    threat: 5,
    willpower: 10,
    players: [
      { id: '0', threat: 28, state: 'active' },
      { id: '1', threat: 45, state: 'waiting' },
      { id: '2', threat: 35, state: 'passed' },
      { id: '3', threat: 28, state: 'eliminated' },
    ],
    progress: { current: 2, target: 10 },
  },
};

export default Story;

export const Primary = {
  args: {},
};
