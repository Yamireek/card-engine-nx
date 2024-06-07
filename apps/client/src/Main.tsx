// import { toJS } from 'mobx';
// import { randomJS } from '@card-engine-nx/basic';
// import { core } from '@card-engine-nx/cards';
// import { ExeCtx, consoleLogger, emptyEvents } from '@card-engine-nx/engine';
// import { State, createState } from '@card-engine-nx/state';

import { core } from "@card-engine-nx/cards";
import { TestEngine } from "@card-engine-nx/engine";

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
  "Discard 1 card from your hand to give Éowyn +1 [willpower] until the end of the phase. This effect may be triggered by each player once each round.";

const game = new TestEngine(
  {
    players: [
      {
        playerArea: [core.hero.eowyn],
        hand: [core.ally.veteranAxehand, core.ally.veteranAxehand],
      },
      {
        playerArea: [core.hero.gimli],
        hand: [core.ally.veteranAxehand],
      },
    ],
  },
  { console: false }
);

const eowyn = game.card("Éowyn");
console.log(eowyn.props.willpower);
console.log(game.actions.length);
game.chooseAction(action);
game.chooseOption("0");
game.chooseOption("3");
console.log(eowyn.props.willpower);
console.log(game.actions.length);
game.chooseAction(action);
console.log(eowyn.props.willpower);
console.log(game.actions.length);
game.do("endPhase");
console.log(eowyn.props.willpower);
game.do("endRound");
console.log(game.actions.length);
