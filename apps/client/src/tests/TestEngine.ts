import {
  Action,
  CardAction,
  SimpleState,
  State,
  createState,
} from '@card-engine-nx/state';
import { CardId, PlayerId, values } from '@card-engine-nx/basic';
import {
  advanceToChoiceState,
  consoleEvents,
  crateExecutionContext,
  createView,
  executeCardAction,
  randomJS,
} from '@card-engine-nx/engine';

const random = randomJS();

export class TestEngine {
  state: State;

  constructor(state: SimpleState) {
    this.state = createState(state);

    advanceToChoiceState(this.state, consoleEvents, true, true, random);
    this.state.choice = undefined;
    this.state.next = [];
  }

  get view() {
    return createView(this.state);
  }

  get actions() {
    return this.view.actions.filter((a) => a.enabled);
  }

  do(...action: Action[]) {
    this.state.next.unshift(...action);
    advanceToChoiceState(this.state, consoleEvents, true, true, random);

    if (this.state.choice) {
      console.log(this.state.choice);
    }
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
    if (this.state.choice?.type === 'actions') {
      throw new Error('no options');
    }

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

  chooseOptions(titles: string[]) {
    if (!this.state.choice || this.state.choice?.type === 'actions') {
      throw new Error('no options');
    }

    const options = this.state.choice.options.filter((o) =>
      titles.includes(o.title)
    );

    this.state.choice = undefined;
    this.do(...options.map((o) => o.action));
  }

  getPlayer(playerId: PlayerId) {
    return new PlayerProxy(this.state, playerId);
  }

  getCard(name: string) {
    const card = values(this.state.cards).find(
      (c) => c.definition.front.name === name
    );

    if (!card) {
      throw new Error('card not found');
    }

    return new CardProxy(this.state, card.id, this);
  }
}

export class CardProxy {
  constructor(
    private _state: State,
    public id: CardId,
    private game: TestEngine
  ) {}

  update(cardAction: CardAction) {
    executeCardAction(
      cardAction,
      this._state.cards[this.id],
      crateExecutionContext(this._state, consoleEvents, random)
    );
    advanceToChoiceState(this._state, consoleEvents, true, true, random);
  }

  get props() {
    const view = createView(this._state);
    return view.cards[this.id].props;
  }

  get token() {
    return this._state.cards[this.id].token;
  }

  get state() {
    return this._state.cards[this.id];
  }

  get view() {
    return this.game.view.cards[this.id];
  }
}

export class PlayerProxy {
  constructor(private state: State, public id: PlayerId) {}

  get player() {
    const player = this.state.players[this.id];
    if (!player) {
      throw new Error('player not found');
    }
    return player;
  }

  get hand() {
    return this.player.zones.hand;
  }

  get library() {
    return this.player.zones.library;
  }
}
