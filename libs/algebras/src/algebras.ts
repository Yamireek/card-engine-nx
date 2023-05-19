import {
  CardId,
  CardNumProp,
  Orientation,
  PlayerId,
  PrintedProps,
} from "@card-engine-nx/basic";
import { Types } from "./types";

export type CardDefinition<T extends Types = Types> = {
  front: PrintedProps & { abilities: T["Ability"][] };
  back: PrintedProps & { abilities: T["Ability"][] };
  orientation: Orientation;
};

export interface GameAlg<T extends Types> {
  seq(a: T["Action"][]): T["Action"];

  addCard(def: CardDefinition<T>): T["Action"];
}

export interface AbilityAlg<T extends Types> {
  ability1(): T["Ability"];
  ability2(): T["Ability"];
}

export interface ExprAlg<T extends Types> {
  bool(v: boolean): T["Bool"];
  and(v: T["Bool"][]): T["Bool"];
  or(v: T["Bool"][]): T["Bool"];

  num(value: number): T["Num"];
  sum(values: T["Num"][]): T["Num"];
}

export interface PlayerAlg<T extends Types> {
  action(target: T["PlayerTarget"], action: T["PlayerAction"]): T["Action"];

  seq(a: T["PlayerAction"][]): T["PlayerAction"];
  draw(amount: T["Num"]): T["PlayerAction"];
  incThreat(amount: T["Num"]): T["PlayerAction"];

  id(id: PlayerId): T["PlayerTarget"];
  each(): T["PlayerTarget"];
}

export interface CardAlg<T extends Types> {
  action(target: T["CardTarget"], action: T["CardAction"]): T["Action"];

  seq(a: T["CardAction"][]): T["CardAction"];

  each(): T["CardTarget"];
  id(id: CardId): T["CardTarget"];

  prop(prop: CardNumProp): T["CardNum"];
}

export type Alg<T extends Types> = GameAlg<T> &
  ExprAlg<T> & {
    player: PlayerAlg<T>;
    card: CardAlg<T>;
    ability: AbilityAlg<T>;
  };
