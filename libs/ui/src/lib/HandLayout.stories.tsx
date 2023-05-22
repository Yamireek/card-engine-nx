import type { Meta } from '@storybook/react';
import { HandLayout } from './HandLayout';

const options = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const cardImages = [
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Theodred.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Gloin.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Gimli.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Legolas.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Thalin.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Eowyn.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Eleanor.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Dunhere.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Denethor.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Glorfindel.jpg',
  'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Beravor.jpg',
];

const Story: Meta<typeof HandLayout> = {
  component: HandLayout,
  title: 'HandLayout',
  args: {
    cardWidth: 200,
    rotate: 5,
    cardImages: [
      'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
      'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
      'https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg',
    ],
  },
  argTypes: {
    cardImages: {
      options: options,
      mapping: {
        0: [],
        1: cardImages.slice(0, 1),
        2: cardImages.slice(0, 2),
        3: cardImages.slice(0, 3),
        4: cardImages.slice(0, 4),
        5: cardImages.slice(0, 5),
        6: cardImages.slice(0, 6),
        7: cardImages.slice(0, 7),
        8: cardImages.slice(0, 8),
        9: cardImages.slice(0, 9),
        10: cardImages.slice(0, 10),
        11: cardImages.slice(0, 11),
        12: cardImages.slice(0, 12),
      },
      control: {
        label: 'card amount',
        type: 'select',
      },
    },
    cardWidth: {
      control: { type: 'range', min: 100, max: 430, step: 1 },
    },
    rotate: {
      control: { type: 'range', min: 0, max: 45, step: 0.1 },
    },
  },
};

export default Story;

export const Primary = {
  args: {},
};
