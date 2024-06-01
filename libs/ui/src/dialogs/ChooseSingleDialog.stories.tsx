import { action } from '@storybook/addon-actions';
import { ComponentProps } from 'react';
import { ChooseSingleDialog } from './ChooseSingleDialog';
import type { Meta } from '@storybook/react';

const width = 430 / 2;
const height = 600 / 2;

const choices: ComponentProps<typeof ChooseSingleDialog>['choices'] = [
  {
    title: 'Test choice 1',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
      width,
      height,
    },
    action: action('1'),
  },
  {
    title: 'Test choice 2',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Th%C3%A9odred.jpg',
      width,
      height,
    },
    action: action('2'),
  },
  {
    title: 'Test choice 3',
    image: {
      src: 'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Gl%C3%B3in.jpg',
      width,
      height,
    },
    action: action('3'),
  },
];

const Story: Meta<typeof ChooseSingleDialog> = {
  component: ChooseSingleDialog,
  title: 'ChooseSingleDialog',
  args: {
    title: 'Test choice',
  },
};
export default Story;

export const Text = {
  args: {
    choices: choices.map((c) => ({ ...c, image: undefined })),
  },
};

export const Images = {
  args: {
    choices,
  },
};

export const Combined = {
  args: {
    choices: [
      ...choices,
      {
        title: 'Skip',
        action: action('none'),
      },
    ],
  },
};
