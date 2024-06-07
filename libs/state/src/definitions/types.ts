import { Orientation, PrintedProps } from "@card-engine-nx/basic";
import { CardRules } from "../card";
import { Shadow } from "../card/ability/shadow";
import { Ability } from "../card/ability/types";

export type CardProps = PrintedProps & {
  abilities?: Ability[];
  rules?: CardRules;
};

export type CardDefinition = {
  front: CardProps;
  back: CardProps;
  shadow?: Shadow;
  orientation: Orientation;
};
