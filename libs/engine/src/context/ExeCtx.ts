import { action, computed, makeObservable, toJS } from 'mobx';
import { Random } from '@card-engine-nx/basic';
import { Scope, State, StateModifiers } from '@card-engine-nx/state';
import { UIEvents, uiEvent } from '../events';
import { Logger } from '../logger';
import { BaseCtx, ViewCtx } from './internal';
import { IExeCtx, SkipOptions } from './types';

export class ExeCtx extends BaseCtx implements IExeCtx {
  constructor(
    state: State,
    events: UIEvents,
    random: Random,
    logger: Logger,
    observable = true
  ) {
    super(state, events, random, logger, observable);
    this.advance({ actions: false, show: false }, true);
    if (observable) {
      makeObservable(this, {
        advance: action,
        actions: computed,
        modifiers: true,
      });
    }
  }

  get actions() {
    return this.modifiers.actions.filter((a) =>
      this.canExecute(a.action, false)
    );
  }

  get modifiers(): StateModifiers {
    return new ViewCtx(this.state).evalMods();
  }

  chooseOnlyOption(skip: SkipOptions) {
    const state = this.state;
    const choice = state.choice;

    if (!choice) {
      return;
    }

    if (choice.type === 'show') {
      if (skip.show) {
        state.choice = undefined;
      }
    }

    if (choice.type === 'single') {
      if (choice.optional && choice.options.length === 0) {
        state.choice = undefined;
      }

      if (!choice.optional && choice.options.length === 1) {
        state.next.unshift(...choice.options.map((o) => o.action));
        state.choice = undefined;
      }

      if (!choice.optional && choice.options.length === 0) {
        state.choice = undefined;
      }
    }

    if (choice.type === 'multi') {
      if (choice.options.length === 0) {
        state.choice = undefined;
      }
    }

    if (choice.type === 'actions') {
      if (skip.actions) {
        const actions = this.actions;
        if (actions.length === 0) {
          state.choice = undefined;
        }
      }
    }
  }

  nextStep() {
    const action = this.state.next.shift();
    if (!action) {
      return false;
    } else {
      this.logger.debug('executing ', toJS(action), toJS(this.state.next));
      this.execute(action);
    }
  }

  advance(skip: SkipOptions, stopOnError: boolean) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      this.chooseOnlyOption(skip);

      if (this.state.choice) {
        return;
      }

      if (this.state.next.length === 0) {
        return;
      }

      try {
        this.nextStep();
        if (
          this.state.choice ||
          this.state.next.length === 0 ||
          this.state.result
        ) {
          continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error) {
        console.log(error);
        this.events.send(uiEvent.error(error.message));
        if (stopOnError) {
          throw error;
        }
      }
    }
  }
}
