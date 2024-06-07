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
  'After Glóin suffers damage, add 1 resource to his resource pool for each point of damage he just suffered.';

const game = new TestEngine({
  players: [{ playerArea: [core.hero.gloin] }],
});

const gloin = game.card('Glóin');
console.log(gloin.token.resources);
console.log(game.modifiers.responses.receivedDamage);
gloin.execute({ dealDamage: 2 });
console.log(game.choiceTitle);
game.chooseOption(action);
console.log(gloin.token.resources);
