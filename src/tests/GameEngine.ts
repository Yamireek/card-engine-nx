import {
  Action,
  CardAction,
  CardDefinition,
  State,
  createState,
} from '@card-engine-nx/state';
import { CardId, PlayerId } from '@card-engine-nx/basic';
import {
  createView,
  executeAction,
  executeCardAction,
} from '@card-engine-nx/engine';
import { addPlayer, addCard } from './addPlayer';
import { Events } from '@card-engine-nx/engine';

export function nextStep(state: State, events: Events) {
  const action = state.next.shift();
  if (!action) {
    return;
  } else {
    executeAction(action, state, events);
  }
}

export function advanceToChoiceState(state: State, events: Events) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (state.choice) {
      if (state.choice.multi === false && state.choice.options.length === 1) {
        state.next.unshift(state.choice.options[0].action);
        state.choice = undefined;
      } else {
        events.updateUi(state);
        return state;
      }
    }

    if (state.next.length === 0) {
      events.updateUi(state);
      return;
    }

    try {
      nextStep(state, events);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      events.onError(error.message);
      events.updateUi(state);
    }
  }
}

export const emptyEvents: Events = {
  onCardMoved: () => {
    return;
  },
  onError: () => {
    return;
  },
  updateUi: () => {
    return;
  },
};

export class GameEngine {
  constructor(public state = createState()) {
    advanceToChoiceState(state, emptyEvents);
    state.choice = undefined;
    state.next = [];
  }

  do(action: Action) {
    this.state.next.unshift(action);
    advanceToChoiceState(this.state, emptyEvents);
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
      addPlayer().execute(this.state);
      return new PlayerProxy(this.state, 'A');
    }

    if (!this.state.players.B) {
      addPlayer().execute(this.state);
      return new PlayerProxy(this.state, 'B');
    }

    throw new Error('cant add new player');
  }

  addHero(hero: CardDefinition): CardProxy {
    this.ensurePlayerA();

    const id = addCard(hero, 'front', {
      type: 'playerArea',
      owner: 'A',
    }).execute(this.state);
    return new CardProxy(this.state, id);
  }
}

export class CardProxy {
  constructor(private state: State, private id: CardId) {}

  update(cardAction: CardAction) {
    executeCardAction(cardAction, this.state.cards[this.id]);
    advanceToChoiceState(this.state, emptyEvents);
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
