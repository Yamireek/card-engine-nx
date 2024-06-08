// import { toJS } from 'mobx';
// import { randomJS } from '@card-engine-nx/basic';
// import { core } from '@card-engine-nx/cards';
// import { ExeCtx, consoleLogger, emptyEvents } from '@card-engine-nx/engine';
// import { State, createState } from '@card-engine-nx/state';

import { core } from '@card-engine-nx/cards';
import { TestEngine } from '@card-engine-nx/engine';

// const state: State = createState({
//   players: [
//     {
//       playerArea: [
//         {
//           card: core.hero.gimli,
//           damage: 0,
//         },
//       ],
//     },
//   ],
// });

// const ctx = new ExeCtx(state, emptyEvents, randomJS(), consoleLogger, true);

// console.log(toJS(ctx.state));

// const card = ctx.getCard(1);

// console.log(toJS(card.props));
const action =
  'Action: Exhaust 1 hero you control to choose and ready a different hero.';

const game = new TestEngine({
  players: [
    {
      playerArea: [
        {
          card: core.hero.gloin,
          exhausted: true,
        },
        core.hero.aragorn,
      ],
      hand: [core.event.commonCause],
    },
  ],
});

const aragorn = game.card('Aragorn');
const gloin = game.card('Glóin');

console.log(game.actions.length);
game.chooseAction(action);
console.log(aragorn.state.tapped);
console.log(gloin.state.tapped);
