import { CardNumProp, Token } from '@card-engine-nx/basic';
import {
  Ability,
  CardExp,
  CardTarget,
  Exp,
  Modifier,
  hero,
} from '@card-engine-nx/state';

export const gimli = hero(
  {
    name: 'Gimli',
    threatCost: 11,
    willpower: 2,
    attack: 2,
    defense: 2,
    hitPoints: 5,
    traits: ['dwarf', 'noble', 'warrior'],
    sphere: 'tactics',
  },
  selfModifier({
    description: 'Gimli gets +1 [attack] for each damage token on him.',
    modifier: increment('attack', expr(self(), count('damage'))),
  })
);

export function expr<T>(target: CardTarget, expr: CardExp<T>): Exp<T> {
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

export function self(): CardTarget {
  return {
    print: () => `"self"`,
    get: (state, ctx) => {
      if (ctx.selfCard) {
        return [ctx.selfCard];
      } else {
        throw new Error('No self card');
      }
    },
  };
}

export function count(token: Token): CardExp<number> {
  return {
    print: () => `count("${token}")`,
    calc: (state, card) => card.token[token],
  };
}

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

export function selfModifier(params: {
  description: string;
  modifier: Modifier;
}): Ability {
  return {
    description: params.description,
    print: () => `selfModifier(${params.modifier.print()})`,
    apply(state, card) {
      card.modifiers.push({
        description: params.description,
        applied: false,
        modifier: params.modifier,
      });
    },
  };
}
