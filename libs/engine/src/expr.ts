import { CardTarget, CardExp, Exp } from '@card-engine-nx/state';

export function card<T>(target: CardTarget, expr: CardExp<T>): Exp<T> {
  return {
    print: () => `expr(${target.print()}, ${expr.print()})`,
    calc(state, ctx) {
      const ids = target.get(state, ctx);
      if (ids.length !== 1) {
        throw new Error('Expected exactly one card');
      } else {
        return expr.calc(state, state.cards[ids[0]]);
      }
    },
  };
}
