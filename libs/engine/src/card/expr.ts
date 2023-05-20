import { Token } from '@card-engine-nx/basic';
import { CardExp } from '@card-engine-nx/state';

export function count(token: Token): CardExp<number> {
  return {
    print: () => `count("${token}")`,
    calc: (state, card) => card.token[token],
  };
}
