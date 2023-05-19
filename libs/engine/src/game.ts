import { Alg, Types } from "@card-engine-nx/algebras";
import { ExecutorTypes } from "./types";
import { cardExecutor } from "./card";
import { playerExecutor } from "./player";

export const gameExecutor: Alg<Types & ExecutorTypes> = {
  and(v) {
    throw new Error();
  },
  or(v) {
    throw new Error();
  },
  sum(values) {
    throw new Error();
  },
  bool(v) {
    throw new Error();
  },
  num(value) {
    return () => value;
  },
  seq(a) {
    throw new Error();
  },
  card: cardExecutor,
  player: playerExecutor,
};
