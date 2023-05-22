import type { Meta } from '@storybook/react';
import { Board } from './Board';

const Story: Meta<typeof Board> = {
  component: Board,
  title: 'Board',
  args: {
    perspective: 400,
    rotate: 45,
  },
  argTypes: {
    perspective: {
      control: { type: 'range', min: 300, max: 5000, step: 5 },
    },
    rotate: {
      control: { type: 'range', min: 0, max: 120, step: 1 },
    },
  },
};
export default Story;

export const Primary = {
  args: {},
};
