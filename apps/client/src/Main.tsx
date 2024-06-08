// import { toJS } from 'mobx';
// import { randomJS } from '@card-engine-nx/basic';
// import { core } from '@card-engine-nx/cards';
// import { ExeCtx, consoleLogger, emptyEvents } from '@card-engine-nx/engine';
// import { State, createState } from '@card-engine-nx/state';

import { toJS } from 'mobx';
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
const game = new TestEngine(
  {
    players: [{ playerArea: [core.hero.dunhere] }],
    stagingArea: [core.enemy.dolGuldurBeastmaster],
  },
  { console: true }
);

const enemy = game.card('Dol Guldur Beastmaster');
const hero = game.card('Dúnhere');

hero.execute({ mark: 'attacking' });
enemy.execute({ mark: 'defending' });

console.log(game.modifiers);
console.log(hero.props.attack);

// game.do({ player: '0', action: 'resolvePlayerAttacks' });
// console.log(toJS(game.state));
// console.log(game.modifiers);
// game.chooseOption('1');
// console.log(enemy.state.token.damage);
