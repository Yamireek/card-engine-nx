import { ComponentProps } from 'react';
import { ChooseMultiDialog } from './ChooseMultiDialog';
import type { Meta } from '@storybook/react';

const width = 430 / 2;
const height = 600 / 2;

const choices: ComponentProps<typeof ChooseMultiDialog>['choices'] = [
  {
    id: 1,
    title: 'Test choice 1',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
      width,
      height,
    },
  },
  {
    id: 2,
    title: 'Test choice 2',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Th%C3%A9odred.jpg',
      width,
      height,
    },
  },
  {
    id: 3,
    title: 'Test choice 3',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Gl%C3%B3in.jpg',
      width,
      height,
    },
  },
];

const Story: Meta<typeof ChooseMultiDialog> = {
  component: ChooseMultiDialog,
  title: 'ChooseMultiDialog',
  args: {
    title: 'Test choice',
  },
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
};
export default Story;

export const Images = {
  args: {
    choices,
  },
};
