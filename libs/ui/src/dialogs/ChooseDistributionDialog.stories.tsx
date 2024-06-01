import { ComponentProps } from 'react';
import { ChooseDistributionDialog } from './ChooseDistributionDialog';
import type { Meta } from '@storybook/react';

const width = 430 / 2;
const height = 600 / 2;

const choices: ComponentProps<typeof ChooseDistributionDialog>['choices'] = [
  {
    id: 1,
    title: 'Test choice 1',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
      width,
      height,
    },
    min: 1,
    max: 2,
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

const Story: Meta<typeof ChooseDistributionDialog> = {
  component: ChooseDistributionDialog,
  title: 'ChooseDistributionDialog',
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
    total: { min: 3, max: 4 },
    count: { min: 2, max: 2 },
  },
};
