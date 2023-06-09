import type { Meta } from '@storybook/react';
import { NextStepButton } from './NextStepButton';

const Story: Meta<typeof NextStepButton> = {
  component: NextStepButton,
  title: 'NextStepButton',
  args: {
    title: 'title',
  },
  argTypes: {
    onClick: { action: 'onClick' },
  },
};
export default Story;

export const Primary = {
  args: {},
};
