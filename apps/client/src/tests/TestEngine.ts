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
  crateExecutionContext,
  createPlayerState,
  createView,
  executeCardAction,
} from '@card-engine-nx/engine';

export class TestEngine {
  constructor(public state = createState()) {
    advanceToChoiceState(
      state,
      consoleEvents,
      true,
      true,
      (v) => v,
      (i) => i[0]
    );
    state.choice = undefined;
    state.next = [];
  }

  do(action: Action) {
    this.state.next.unshift(action);
    advanceToChoiceState(
      this.state,
      consoleEvents,
      true,
      true,
      (v) => v,
      (i) => i[0]
    );
  }

  get view() {
    return createView(this.state);
  }

  get actions() {
    return this.view.actions;
  }

  chooseAction(description: string) {
    const action = this.actions.find((a) => a.description === description);
    if (!action) {
      throw new Error(
        `action not found, available: ${this.actions
          .map((a) => a.description)
          .join(', ')}`
      );
    }

    this.do(action.action);
  }

  chooseOption(description: string) {
    const option = this.state.choice?.options.find(
      (o) => o.title === description
    );
    if (!option) {
      throw new Error(
        `option not found, available: ${this.state.choice?.options
          .map((a) => a.title)
          .join(', ')}`
      );
    }
    this.state.choice = undefined;
    this.do(option.action);
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

  private ensurePlayer0() {
    if (!this.state.players['0']) {
      this.addPlayer();
    }
  }

  addPlayer() {
    if (!this.state.players['0']) {
      this.state.players['0'] = createPlayerState('0');
      return new PlayerProxy(this.state, '0');
    }

    if (!this.state.players['1']) {
      this.state.players['1'] = createPlayerState('1');
      return new PlayerProxy(this.state, '1');
    }

    throw new Error('cant add new player');
  }

  addHero(hero: CardDefinition, player?: PlayerProxy): CardProxy {
    this.ensurePlayer0();

    const id = addPlayerCard(
      this.state,
      hero,
      player?.id ?? '0',
      'front',
      'playerArea'
    );
    return new CardProxy(this.state, id);
  }

  addToLibrary(hero: CardDefinition): CardProxy {
    this.ensurePlayer0();

    const id = addPlayerCard(this.state, hero, '0', 'back', 'library');
    return new CardProxy(this.state, id);
  }

  addToHand(card: CardDefinition, player: PlayerProxy): CardProxy {
    const id = addPlayerCard(this.state, card, player.id, 'front', 'hand');
    return new CardProxy(this.state, id);
  }
}

export class CardProxy {
  constructor(private _state: State, private id: CardId) {}

  update(cardAction: CardAction) {
    executeCardAction(
      cardAction,
      this._state.cards[this.id],
      crateExecutionContext(this._state, consoleEvents, (v) => v)
    );
    advanceToChoiceState(
      this._state,
      consoleEvents,
      true,
      true,
      (v) => v,
      (i) => i[0]
    );
  }

  get props() {
    const view = createView(this._state);
    return view.cards[this.id].props;
  }

  get token() {
    return this._state.cards[this.id].token;
  }

  get responses() {
    const view = createView(this._state);
    return view.cards[this.id].responses;
  }

  get state() {
    return this._state.cards[this.id];
  }
}

export class PlayerProxy {
  constructor(private state: State, public id: PlayerId) {}

  get hand() {
    return this.state.players[this.id]!.zones.hand;
  }

  get library() {
    return this.state.players[this.id]!.zones.library;
  }
}
