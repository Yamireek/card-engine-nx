import { Alg, Types } from "@card-engine-nx/algebras";

export type Modifier = <T extends Types>(alg: Alg<T>) => T["Modifier"];

export type ModifierState = {
  description: string;
  modifier: Modifier;
  until: "end_of_phase" | "end_of_round";
};
