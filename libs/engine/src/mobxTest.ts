import { isArray, last } from 'lodash/fp';
import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  toJS,
} from 'mobx';

type Card = { id: number; a: number; d: number };

type Effect = (cards: Card[]) => Card[];

type Target = number | { var: string };

type Action =
  | 'begin'
  | 'end'
  | Action[]
  | {
      addCard: { a: number; d: number };
    }
  | { addEffect: Effect }
  | { choose: Action[] }
  | { useVar: string; value: number; action: Action }
  | { setVar: string; value: number }
  | { clearVar: string }
  | { incA: Target; amount: number };

type State = {
  nextId: number;
  cards: Card[];
  effects: Effect[];
  next: Action[];
  choice?: Action[];
  scopes: Array<{ vars: Record<string, number> }>;
};

class Game {
  state: State = { nextId: 1, cards: [], effects: [], next: [], scopes: [] };

  constructor() {
    makeObservable(this, {
      state: observable,
      view: computed,
      update: action,
    });
  }

  update(f: (s: State) => void) {
    f(this.state);
  }

  get view() {
    const cards = toJS(this.state.cards);
    return this.state.effects.reduce((p, c) => c(p), cards);
  }
}

function getTarget(t: Target, s: State): number {
  if (typeof t === 'number') {
    return t;
  }

  const scope = last(s.scopes);

  return scope?.vars[t.var] ?? 0;
}

function toUpdate(action: Action): (s: State) => void {
  if (isArray(action)) {
    return (s) => {
      s.next.unshift(...action);
    };
  }

  if (action === 'begin') {
    return (s) => s.scopes.push({ vars: {} });
  }

  if (action === 'end') {
    return (s) => s.scopes.pop();
  }

  if ('addCard' in action) {
    return (s) => {
      const id = s.nextId++;
      return s.cards.push({ id, ...action.addCard });
    };
  }

  if ('addEffect' in action) {
    return (s) => s.effects.push(action.addEffect);
  }

  if ('choose' in action) {
    return (s) => {
      s.choice = action.choose;
    };
  }

  if ('useVar' in action) {
    return (s) => {
      s.next.unshift(
        'begin',
        { setVar: action.useVar, value: action.value },
        action.action,
        'end'
      );
    };
  }

  if ('setVar' in action) {
    return (s) => {
      const scope = last(s.scopes);
      if (scope) {
        scope.vars[action.setVar] = action.value;
      }
    };
  }

  if ('incA' in action) {
    return (s) => {
      const id = getTarget(action.incA, s);
      const card = s.cards.find((c) => c.id === id);
      if (card) {
        card.a += action.amount;
      }
    };
  }

  throw new Error(JSON.stringify(action));
}

const game = new Game();

autorun(() => {
  console.log(toJS(game.view));
});

game.update((s) => {
  return s.next.push(
    { addCard: { a: 1, d: 1 } },
    {
      useVar: 'test',
      value: 1,
      action: [
        {
          choose: [{ addCard: { a: 1, d: 2 } }, { addCard: { a: 2, d: 1 } }],
        },
        {
          incA: { var: 'test' },
          amount: 1,
        },
      ],
    }
  );
});

moveToChoice();

console.log(toJS(game.state.choice));

const choice = game.state.choice![0];
game.update((s) => {
  return (s.choice = undefined);
});
game.update(toUpdate(choice));
moveToChoice();

function moveToChoice() {
  while (game.state.next.length > 0 && !game.state.choice) {
    game.update((s) => {
      const action = s.next.shift();
      if (action) {
        toUpdate(action)(s);
      }
    });
  }
}

console.log(toJS(game.state.scopes));
