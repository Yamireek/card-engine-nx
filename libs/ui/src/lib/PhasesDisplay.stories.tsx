import type { Meta } from '@storybook/react';
import { PhasesDisplay } from './PhasesDisplay';

const Story: Meta<typeof PhasesDisplay> = {
  component: PhasesDisplay,
  title: 'PhasesDisplay',
  args: {
    phase: 'planning',
  },
};
export default Story;

export const Primary = {
  args: {},
};
