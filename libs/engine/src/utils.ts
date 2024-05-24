import {
  CardDefinition,
  Scope,
  State,
  createCardState,
} from '@card-engine-nx/state';
import {
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
} from '@card-engine-nx/basic';
import { executeAction } from './action/execute';
import { ExecutionContext, ObservableContext } from './context/execution';
import { createView } from './view';
import { Logger } from './logger/types';
import { toJS } from 'mobx';

// TODO replace with action
export function addPlayerCard(
  state: State,
  definition: CardDefinition,
  owner: PlayerId,
  side: Side,
  zone: PlayerZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(
    id,
    side,
    definition,
    zone !== 'engaged' ? owner : undefined,
    {
      player: owner,
      type: zone,
    }
  );
  state.players[owner]?.zones[zone].cards.push(id);
  state.nextId++;
  return id;
}

// TODO replace with action
export function addGameCard(
  state: State,
  definition: CardDefinition,
  side: Side,
  zone: GameZoneType
) {
  const id = state.nextId;
  state.cards[id] = createCardState(id, side, definition, undefined, zone);
  state.zones[zone].cards.push(id);
  state.nextId++;
}

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
