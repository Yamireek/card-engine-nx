import type { Meta } from "@storybook/react";
import { HandLayout } from "./HandLayout";

const Story: Meta<typeof HandLayout> = {
  component: HandLayout,
  title: "HandLayout",
  args: {
    cardWidth: 200,
    cards: 3,
  },
  argTypes: {
    cards: {
      control: { type: "range", min: 0, max: 15, step: 1 },
    },
    cardWidth: {
      control: { type: "range", min: 100, max: 430, step: 1 },
    },
  },
};
export default Story;

export const Primary = {
  args: {},
};
