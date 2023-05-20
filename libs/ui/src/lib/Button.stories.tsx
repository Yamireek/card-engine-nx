import type { Meta } from '@storybook/react';
import { Button } from './Button';

const Story: Meta<typeof Button> = {
  component: Button,
  title: 'Button',
};
export default Story;

export const Primary = {
  args: {},
};
