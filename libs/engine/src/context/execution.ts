import { action, computed, makeObservable } from 'mobx';
import { Random } from '@card-engine-nx/basic';
import {
  Action,
  Scope,
  State,
  UserCardAction,
  View,
} from '@card-engine-nx/state';
import { canExecute } from '../action';
import { uiEvent } from '../events';
import { UIEvents } from '../events/uiEvents';
import { Logger } from '../logger';
import { SkipOptions, chooseOnlyOption, nextStep } from '../utils';
import { createView } from '../view';
import { createViewContext } from './view';

export type ExecutionContext = {
  state: State;
  view: View;
  events: UIEvents;
  random: Random;
  logger: Logger;
  scopes: Scope[];
  next: (...action: Action[]) => void;
};

export class ObservableContext implements ExecutionContext {
  constructor(
    public state: State,
    public events: UIEvents,
    public random: Random,
    public logger: Logger,
    observable = true
  ) {
    if (observable) {
      makeObservable(this, {
        state: observable,
        view: computed({ keepAlive: true }),
        actions: computed({ keepAlive: true }),
        advance: action,
      });
    }
  }

  next(...action: Action[]) {
    this.state.next.unshift(...action);
  }

  get view(): View {
    return createView(this.state);
  }

  get actions() {
    return getActions(this.state, this.view);
  }

  get scopes() {
    return this.state.scopes;
  }

  advance(skip: SkipOptions, stopOnError: boolean) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      chooseOnlyOption(this, skip);

      if (this.state.choice) {
        return;
      }

      if (this.state.next.length === 0) {
        return;
      }

      try {
        nextStep(this, this.logger);
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

export function getActions(state: State, view: View): UserCardAction[] {
  return view.actions.filter((a) =>
    canExecute(a.action, true, createViewContext(state, view))
  );
}
