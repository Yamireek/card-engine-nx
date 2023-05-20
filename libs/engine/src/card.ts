import { CardAlg, Types } from '@card-engine-nx/algebras';
import { keys } from '@card-engine-nx/basic';
import { ExecutorTypes } from '@card-engine-nx/state';

export const cardExecutor: CardAlg<Types & ExecutorTypes> = {
  action(target, action) {
    return (state, ctx) => action(state, target(state, ctx));
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
  count(type) {
    return (state, card) => card.token[type];
  },
  num(num, target) {
    return (state, ctx) => {
      const ids = target(state, ctx);
      if (ids.length !== 1) {
        throw new Error('expected exactly one card');
      }
      return num(state, state.cards[ids[0]], ctx);
    };
    // return (state: State, card: CardState, ctx: Context) => {
    //   return num(state, card, ctx);
    // };
  },
  self() {
    return (state, ctx) => {
      if (ctx.selfCard) {
        return [ctx.selfCard];
      } else {
        throw new Error('no selfCard in ctx');
      }
    };
  },
};
