import { CardTarget } from '@card-engine-nx/state';

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
