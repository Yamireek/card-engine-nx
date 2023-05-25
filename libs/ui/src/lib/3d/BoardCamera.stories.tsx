import type { Meta } from '@storybook/react';
import { Board } from './Board';
import boardImage from './../../images/board.jpg';
import { BoardCamera } from './BoardCamera';

const Story: Meta<typeof BoardCamera> = {
  component: BoardCamera,
  title: 'BoardCamera',
  args: {
    perspective: 500,
    angle: 10,    
    rotation: 0,
  },
  argTypes: {
    perspective: {
      control: { type: 'range', min: 300, max: 5000, step: 5 },
    },
    angle: {
      control: { type: 'range', min: 0, max: 90, step: 1 },
    },
    rotation: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
    },
  },
};
export default Story;

export const Primary = {
  args: {},
};
