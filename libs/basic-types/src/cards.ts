import { Orientation, Sphere, Trait } from "./enums";
import { Flavor } from "./flavors";

export type CardId = Flavor<number, "CardId">;

export type CardNumProp = "attack" | "defense" | "willpower";

export type PrintedProps =
  | HeroProps
  | AllyProps
  | EnemyProps
  | EventProps
  | QuestProps
  | AttachmentProps
  | LocationProps
  | TreacheryProps;

export type HeroProps = {
  type: "hero";
  name: string;
  threatCost: number;
  willpower: number;
  attack: number;
  defense: number;
  hitPoints: number;
  traits: Trait[];
  sphere: Sphere;
};

export type AllyProps = {
  type: "ally";
  name: string;
  unique: boolean;
  cost: number;
  willpower: number;
  attack: number;
  defense: number;
  hitPoints: number;
  traits: Trait[];
  sphere: Sphere;
};

export type EventProps = {
  type: "event";
  name: string;
  cost: number;
  sphere: Sphere;
};

export type AttachmentProps = {
  type: "attachment";
  name: string;
  unique: boolean;
  cost: number;
  traits: Trait[];
  sphere: Sphere;
};

export type LocationProps = {
  type: "location";
  name: string;
  threat: number;
  questPoints: number;
  traits: Trait[];
  victory?: number;
};

export type EnemyProps = {
  type: "enemy";
  name: string;
  engagement: number;
  threat: number;
  attack: number;
  defense: number;
  hitPoints: number;
  traits: Trait[];
  victory?: number;
};

export type QuestProps = {
  type: "quest";
  name: string;
  sequence: number;
  questPoints: number;
};

export type TreacheryProps = {
  type: "treachery";
  name: string;
};

export type CardDefinition = {
  face: PrintedProps;
  back: PrintedProps;
  orientation: Orientation;
};
