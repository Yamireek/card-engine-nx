import {
  Action,
  CardAction,
  CardDefinition,
  State,
  createState,
} from '@card-engine-nx/state';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import {
  addPlayerCard,
  advanceToChoiceState,
  consoleEvents,
  createPlayerState,
  createView,
  executeCardAction,
} from '@card-engine-nx/engine';

export class TestEngine {
  constructor(public state = createState()) {
    advanceToChoiceState(state, consoleEvents);
    state.choice = undefined;
    state.next = [];
  }

  do(action: Action) {
    this.state.next.unshift(action);
    advanceToChoiceState(this.state, consoleEvents);
  }

  // doAction(title: string) {
  //   const action = this.actions.find((a) => a.description === title);
  //   if (action) {
  //     this.do(action.action);
  //   } else {
  //     throw new Error(
  //       'action not found, choices are: \r\n' +
  //         this.actions.map((o) => o.description).join('\r\n')
  //     );
  //   }
  // }
  // makeChoice(title: string, index: number) {
  //   if (this.state.choice) {
  //     if (this.state.choice.title === title) {
  //       const action = this.state.choice.options[index].action;
  //       this.state.choice = undefined;
  //       this.do(action);
  //     } else {
  //       throw new Error(`Different choice title: ${this.state.choice.title}`);
  //     }
  //   } else {
  //     throw new Error('no choices');
  //   }
  // }
  // chooseOption(title: string) {
  //   if (!this.state.choice) {
  //     throw new Error('no choice');
  //   }
  //   const option = this.state.choice.options.find((o) => o.title === title);
  //   if (option) {
  //     this.state.choice = undefined;
  //     this.do(option.action);
  //   } else {
  //     throw new Error(
  //       'option not found, choices are: \r\n' +
  //         this.state.choice.options.map((o) => o.title).join('\r\n')
  //     );
  //   }
  // }

  private ensurePlayerA() {
    if (!this.state.players.A) {
      this.addPlayer();
    }
  }

  addPlayer() {
    if (!this.state.players.A) {
      this.state.players.A = createPlayerState('A');
      return new PlayerProxy(this.state, 'A');
    }

    if (!this.state.players.B) {
      this.state.players.A = createPlayerState('B');
      return new PlayerProxy(this.state, 'B');
    }

    throw new Error('cant add new player');
  }

  addHero(hero: CardDefinition): CardProxy {
    this.ensurePlayerA();

    const id = addPlayerCard(this.state, hero, 'A', 'front', 'playerArea');
    return new CardProxy(this.state, id);
  }
}

export class CardProxy {
  constructor(private state: State, private id: CardId) {}

  update(cardAction: CardAction) {
    executeCardAction(cardAction, this.state.cards[this.id]);
    advanceToChoiceState(this.state, consoleEvents);
  }

  get props() {
    const view = createView(this.state);
    return view.cards[this.id].props;
  }

  get token() {
    return this.state.cards[this.id].token;
  }
}

export class PlayerProxy {
  constructor(private state: State, public id: PlayerId) {}
}
