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
const response =
  'After Legolas participates in an attack that destroys an enemy, place 2 progress tokens on the current quest.';

const game = new TestEngine({
  players: [
    {
      playerArea: [core.hero.legolas],
      engaged: [core.enemy.dolGuldurOrcs],
    },
  ],
  activeLocation: [core.location.mountainsOfMirkwood],
});

const legolas = game.card('Legolas');
const location = game.card('Mountains of Mirkwood');
const enemy = game.card('Dol Guldur Orcs');
game.do({
  card: enemy.id,
  action: {
    dealDamage: {
      amount: 5,
      attackers: [legolas.id],
    },
  },
});
game.chooseOption(response);
console.log(location.token.progress);
