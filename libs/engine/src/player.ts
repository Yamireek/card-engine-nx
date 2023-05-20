import { PlayerAlg, Types } from '@card-engine-nx/algebras';
import { ExecutorTypes } from '@card-engine-nx/state';

export const playerExecutor: PlayerAlg<Types & ExecutorTypes> = {
  action(target, action) {
    return (state) => action(state, target(state));
  },
  draw(amount) {
    throw new Error();
  },
  each() {
    throw new Error();
  },
  id(id) {
    return () => [id];
  },
  incThreat(amount) {
    throw new Error();
  },
  seq(a) {
    throw new Error();
  },
};
