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
    players: [
      {
        playerArea: [{ card: core.hero.gimli, exhausted: true, resources: 2 }],
      },
    ],
    encounterDeck: [core.treachery.caughtInAWeb],
  },
  { console: false }
);

const gimli = game.card('Gimli');
const treatchery = game.card('Caught in a Web');
game.do('revealEncounterCard');
console.log(game.state);
console.log(gimli.state.attachments); //.toHaveLength(1);
gimli.execute({ ready: 'refresh' });
game.chooseOption('Yes');
console.log(gimli.state.token.resources); //.toBe(0);
console.log(gimli.state.tapped); //.toBe(false);
treatchery.execute('discard');
console.log(game.state.modifiers); //.toHaveLength(0);
