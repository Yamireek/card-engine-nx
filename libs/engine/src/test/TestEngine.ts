import { padStart } from 'lodash';
import { observable, toJS } from 'mobx';
import { CardId, PlayerId, Tokens, noRandom } from '@card-engine-nx/basic';
import {
  Action,
  CardAction,
  CardNumberExpr,
  CardProps,
  CardRules,
  CardState,
  CardStateModifier,
  CardTarget,
  Choice,
  SimpleState,
  createState,
} from '@card-engine-nx/state';
import { BaseCtx, CardCtx, ExeCtx, ZoneCtx } from '../context';
import { emptyEvents } from '../events/uiEvents';
import { consoleLogger } from '../logger/console';
import { nullLogger } from '../logger/null';

const random = noRandom();

export class TestEngine extends ExeCtx {
  step = 0;

  constructor(
    state: SimpleState,
    public params: {
      observable?: boolean;
      console?: boolean;
      file?: boolean;
    } = {}
  ) {
    super(
      createState(state),
      emptyEvents,
      random,
      params.console ? consoleLogger : nullLogger,
      params.observable ?? false
    );
    this.auto();
    this.state.choice = undefined;
    this.state.next = [];
  }

  get choiceTitle() {
    if (this.state.choice && 'title' in this.state.choice) {
      return this.state.choice.title;
    }
  }

  auto() {
    this.advance({ actions: true, show: true }, true);
  }

  do(...action: Action[]) {
    this.state.next.unshift(...action, 'stateCheck');
    this.auto();

    if (this.state.choice) {
      if (this.state.choice.type === 'actions') {
        //this.logger.debug('actions', this.ctx.actions);
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

  card(name: string) {
    const card = this.getCard({ name });
    return new TestCard(this, card);
  }

  player(id: PlayerId) {
    const player = this.state.players[id];
    if (!player) {
      throw new Error('player not found');
    }
    return player.zones;
  }
}

export class TestCard {
  constructor(public engine: TestEngine, public base: CardCtx) {}
  get id() {
    return this.base.id;
  }
  get state() {
    return this.base.state;
  }
  get token() {
    return this.base.token;
  }
  get props() {
    return this.base.props;
  }

  execute(action: CardAction) {
    this.engine.do({ card: this.base.id, action });
  }
}
