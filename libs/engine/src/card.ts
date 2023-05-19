import { CardAlg, Types } from "@card-engine-nx/algebras";
import { keys } from "@card-engine-nx/basic";
import { ExecutorTypes } from "./types";

export const cardExecutor: CardAlg<Types & ExecutorTypes> = {
  action(target, action) {
    return (state) => action(state, target(state));
  },
  each() {
    return (state) => keys(state.cards);
  },
  id(id) {
    return () => [id];
  },
  seq(a) {
    throw new Error();
  },
  prop(prop) {
    throw new Error();
  },
};
