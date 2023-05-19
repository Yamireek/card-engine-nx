import { PlayerAlg, Types } from "@card-engine-nx/algebras";
import { ExecutorTypes } from "./types";

export const playerExecutor: PlayerAlg<Types & ExecutorTypes> = {
  action(target, action) {
    throw new Error();
  },
  draw(amount) {
    throw new Error();
  },
  each() {
    throw new Error();
  },
  id(id) {
    throw new Error();
  },
  incThreat(amount) {
    throw new Error();
  },
  seq(a) {
    throw new Error();
  },
};
