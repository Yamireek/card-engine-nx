// import { toJS } from 'mobx';
// import { randomJS } from '@card-engine-nx/basic';
// import { core } from '@card-engine-nx/cards';
// import { ExeCtx, consoleLogger, emptyEvents } from '@card-engine-nx/engine';
// import { State, createState } from '@card-engine-nx/state';

import { core } from '@card-engine-nx/cards';
import { TestEngine } from '@card-engine-nx/engine';
import { toJS } from 'mobx';

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
const game = new TestEngine({
  players: [
    {
      playerArea: [
        {
          card: core.hero.gimli,
          attachments: [core.attachment.citadelPlate],
        },
      ],
    },
  ],
});

const gimli = game.card('Gimli');
console.log(gimli.props.hitPoints);
console.log(toJS(game.modifiers));
