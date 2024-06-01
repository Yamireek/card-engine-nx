import { CardDisplay } from './CardDisplay';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof CardDisplay> = {
  component: CardDisplay,
  title: 'CardDisplay',
  args: {
    height: 600,
    image:
      'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
    mark: {
      attacking: true,
      attacked: true,
      defending: true,
      questing: true,
    },
    token: {
      damage: 1,
      progress: 1,
      resources: 1,
    },
    tapped: false,
    orientation: 'portrait',
  },
  argTypes: {
    onClick: { action: 'onClick' },
    onMouseEnter: { action: 'onMouseEnter' },
  },
};
export default Story;

export const Primary = {
  args: {},
};
