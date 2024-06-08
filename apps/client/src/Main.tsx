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
const response =
  'Response: After Gandalf enters play, (choose 1): draw 3 cards, deal 4 damage to 1 enemy in play, or reduce your threat by 5.';

const game = new TestEngine({
  players: [
    {
      playerArea: [
        {
          card: core.hero.gimli,
          resources: 5,
        },
      ],
      hand: [core.ally.gandalf],
    },
  ],
});

const gandalf = game.card('Gandalf');
game.do({ beginPhase: 'planning' });
game.chooseAction('Play ally Gandalf');
game.chooseOption(response);
console.log(game.state.players['0']?.thread);
game.do('endRound');
console.log(gandalf.state.zone);
