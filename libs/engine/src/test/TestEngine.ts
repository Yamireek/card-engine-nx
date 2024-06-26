import { padStart } from 'lodash';
import { toJS } from 'mobx';
import { CardId, PlayerId, noRandom, values } from '@card-engine-nx/basic';
import {
  Action,
  CardAction,
  Choice,
  SimpleState,
  State,
  createState,
} from '@card-engine-nx/state';
import { ObservableContext } from '../context';
import { emptyEvents } from '../events/uiEvents';
import { consoleLogger } from '../logger/console';
import { nullLogger } from '../logger/null';
import { Logger } from '../logger/types';
import { createView } from '../view';

const random = noRandom();

export class TestEngine {
  logger: Logger;

  ctx: ObservableContext;

  step = 0;

  constructor(
    state: SimpleState,
    public params: {
      observable?: boolean;
      console?: boolean;
      file?: boolean;
    } = {}
  ) {
    this.logger = params.console ? consoleLogger : nullLogger;
    this.ctx = new ObservableContext(
      createState(state),
      emptyEvents,
      random,
      this.logger,
      params.observable ?? false
    );

    this.advance();
    this.state.choice = undefined;
    this.state.next = [];
  }

  get state() {
    return this.ctx.state;
  }

  get view() {
    return this.ctx.view;
  }

  get actions() {
    return this.ctx.actions;
  }

  get choiceTitle() {
    if (this.state.choice && 'title' in this.state.choice) {
      return this.state.choice.title;
    }
  }

  advance() {
    this.ctx.advance({ actions: true, show: true }, true);
  }

  do(...action: Action[]) {
    this.state.next.unshift(...action, 'stateCheck');
    this.advance();

    if (this.state.choice) {
      if (this.state.choice.type === 'actions') {
        this.logger.debug('actions', this.ctx.actions);
      } else {
        this.logger.debug('choice', toJS(this.state.choice));
      }
    }

    this.logToFile();
  }

  logToFile() {
    this.step++;
    if (this.params.file) {
      const name = `./logs/${padStart(this.step.toString(), 3, '0')}.json`;
      const content = JSON.stringify(this.state, null, 1);
      import('fs').then((fs) => {
        fs.writeFileSync(name, content);
      });
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

    const next: Choice | undefined =
      this.state.choice && this.state.choice.type === 'actions'
        ? {
            id: this.state.choice.id,
            type: 'actions',
            title: this.state.choice.title,
          }
        : undefined;

    this.state.choice = undefined;

    this.do([
      action.action,
      next
        ? {
            choice: next,
          }
        : [],
    ]);

    this.logToFile();
  }

  skip() {
    if (this.state.choice) {
      if (this.state.choice.type === 'actions') {
        this.state.choice = undefined;
        this.do([]);
        return;
      }

      if (
        this.state.choice.type === 'multi' ||
        this.state.choice?.type === 'single'
      ) {
        this.state.choice = undefined;
        this.do([]);
        return;
      }
    } else {
      throw new Error('no choice to skip');
    }

    this.logToFile();
  }

  chooseOption(description: string) {
    if (!this.state.choice || !('options' in this.state.choice)) {
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

    this.logToFile();
  }

  chooseOptions(titles: string[]) {
    if (!this.state.choice || !('options' in this.state.choice)) {
      throw new Error('no options');
    }

    const options = this.state.choice.options.filter((o) =>
      titles.includes(o.title)
    );

    this.state.choice = undefined;
    this.do(...options.map((o) => o.action));

    this.logToFile();
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
    this.game.do({ card: this.id, action: cardAction });
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
