import {
  Scope,
} from '@card-engine-nx/state';
import { executeAction } from './action/execute';
import { ExecutionContext, ObservableContext } from './context/execution';
import { Logger } from './logger/types';
import { toJS } from 'mobx';

export function nextStep(
  ctx: ExecutionContext,
  logger: Logger,
  scopes: Scope[]
) {
  const action = ctx.state.next.shift();
  if (!action) {
    return false;
  } else {
    logger.log('executing ', toJS(action), toJS(ctx.state.next));
    executeAction(action, ctx, scopes);
  }
}

export type SkipOptions = { show: boolean; actions: boolean };

export function chooseOnlyOption(ctx: ObservableContext, skip: SkipOptions) {
  const state = ctx.state;
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
      const actions = ctx.actions;
      if (actions.length === 0) {
        state.choice = undefined;
      }
    }
  }
}

export function single<T>(items: T[]): T {
  if (items.length === 1) {
    return items[0];
  } else {
    throw new Error('expecting 1 item');
  }
}
