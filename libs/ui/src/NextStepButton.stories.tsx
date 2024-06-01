import { NextStepButton } from './NextStepButton';
import type { Meta } from '@storybook/react';

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
