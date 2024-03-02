import { Action, State, View } from '@card-engine-nx/state';
import { UIEvents } from '../events/uiEvents';
import { Random } from '../utils/random';
import { createView } from '../view';
import { action, computed, makeObservable, observable } from 'mobx';
import { SkipOptions, chooseOnlyOption, nextStep } from '../utils';
import { Logger } from '../logger';
import { uiEvent } from '../events';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  random: Random;
  next: (...action: Action[]) => void;
};

export class ObservableContext implements ExecutionContext {
  constructor(
    public state: State,
    public events: UIEvents,
    public random: Random,
    public logger: Logger
  ) {
    makeObservable(this, {
      state: observable,
      view: computed({ keepAlive: true }),
      advance: action,
    });
  }

  next(...action: Action[]) {
    this.state.next.unshift(...action);
  }

  get view(): View {
    return createView(this.state);
  }

  advance(skip: SkipOptions, stopOnError: boolean) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      chooseOnlyOption(this.state, skip);

      if (this.state.choice) {
        return;
      }

      if (this.state.next.length === 0) {
        return;
      }

      try {
        nextStep(this, this.logger, []);
        if (
          this.state.choice ||
          this.state.next.length === 0 ||
          this.state.result
        ) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        this.events.send(uiEvent.error(error.message));
        if (stopOnError) {
          throw error;
        }
      }
    }
  }
}
