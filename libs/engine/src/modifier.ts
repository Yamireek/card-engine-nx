import { CardNumProp } from '@card-engine-nx/basic';
import { Exp, Modifier } from '@card-engine-nx/state';

export function increment(prop: CardNumProp, amount: Exp<number>): Modifier {
  return {
    print: () => `increment("${prop}", ${amount.print()})`,
    apply(state, card, ctx) {
      const value = card.props[prop];
      if (value !== undefined) {
        card.props[prop] = value + amount.calc(state, ctx);
      }
    },
  };
}
