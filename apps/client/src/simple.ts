import { produce } from 'immer';
import {
  autorun,
  computed,
  getDependencyTree,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx';

type CardProperty = 'attack' | 'defense';

type CardType = 'hero' | 'ally' | 'enemy';

type CardProps = {
  type: CardType;
  attack: number;
  defense: number;
};

type CardState = {
  id: number;
  printed: CardProps;
  damage: number;
};

type PropertyModifier =
  | {
      prop: CardProperty;
      bonus: number;
    }
  | {
      type: CardType;
    };

type CardTarget = number | { type: CardType };

type State = {
  cards: Map<number, CardState>;
  effects: Effect[];
};

type Value =
  | number
  | { count: CardTarget }
  | { sum: CardProperty }
  | { target: number; count: 'damage' };

type CardEffect =
  | {
      prop: CardProperty;
      inc: Value;
    }
  | { type: CardType };

type View = {
  cards: Map<number, PropertyModifier[]>;
};

type Effect = {
  card: CardTarget;
  mod: CardEffect;
};

abstract class BaseCtx {
  constructor(public state: State) {
    makeObservable(this, {
      cardList: computed({ keepAlive: true }),
      state: observable,
    });
  }

  get cardList(): Map<number, CardProxy> {
    return new Map(
      Array.from(this.state.cards.entries()).map((entry) => [
        entry[0],
        new CardProxy(this, entry[0]),
      ])
    );
  }

  value(value: Value) {
    if (typeof value === 'number') {
      return value;
    }

    if ('count' in value && 'target' in value) {
      if (value.count === 'damage') {
        const target = this.target(value.target);
        return target.map((t) => t.state.damage).reduce((p, c) => p + c, 0);
      }

      return 0;
    }

    if ('count' in value) {
      return this.target(value.count).length;
    }

    if ('sum' in value) {
      return [...this.cardList.values()].reduce(
        (p, c) => p + c.props[value.sum],
        0
      );
    }
  }

  target(target: CardTarget): CardProxy[] {
    if (typeof target === 'number') {
      const card = this.cardList.get(target);
      if (!card) {
        throw new Error('not found');
      }
      return [card];
    }

    if ('type' in target) {
      return [...this.cardList.values()].filter(
        (c) => c.props.type === target.type
      );
    }

    throw new Error('unknown target');
  }

  abstract get view(): View;
}

class ViewCtx extends BaseCtx {
  private readonly _view: View;

  constructor(state: State) {
    super(state);

    const cards = new Map(
      Array.from(this.state.cards.entries()).map((entry) => [entry[0], []])
    );

    this._view = { cards };
  }

  createView(): View {
    const base = this.view;

    for (const effect of this.state.effects) {
      const targets = this.target(effect.card);
      for (const target of targets) {
        const baseView = base.cards.get(target.id);
        if (baseView) {
          if ('prop' in effect.mod) {
            const bonus = this.value(effect.mod.inc);
            if (bonus) {
              baseView.push({
                prop: effect.mod.prop,
                bonus: bonus,
              });
            }
          }

          if ('type' in effect.mod) {
            baseView.push({ type: effect.mod.type });
          }
        }
      }
    }

    return base;
  }

  get view(): View {
    return this._view;
  }
}

class ExeCtx extends BaseCtx {
  constructor(state: State) {
    super(state);
    makeObservable(this, {
      view: computed({ keepAlive: true }),
    });
  }

  get view(): View {
    console.log('get view');
    return new ViewCtx(this.state).createView();
  }
}

class CardProxy {
  constructor(public game: BaseCtx, public readonly id: number) {
    console.log('cardProxt', id);
    makeObservable(this, {
      state: computed({ keepAlive: true }),
      props: computed({ keepAlive: true }),
    });
  }

  get state() {
    const state = this.game.state.cards.get(this.id);
    if (!state) {
      throw new Error('not found');
    }
    return state;
  }

  get props(): CardProps {
    const view = this.game.view.cards.get(this.id);
    if (!view || view?.length === 0) {
      return this.state.printed;
    }

    const props = produce(this.state.printed, (draft) => {
      for (const modifier of view) {
        if ('bonus' in modifier) {
          const value = draft[modifier.prop] ?? 0;
          draft[modifier.prop] = value + modifier.bonus;
        } else {
          draft.type = modifier.type;
        }
      }
    });

    return props;
  }
}

const ctx = new ExeCtx({
  cards: new Map(),
  effects: [],
});

ctx.state.cards.set(1, {
  id: 1,
  damage: 0,
  printed: { attack: 1, defense: 1, type: 'hero' },
});

console.log(ctx.state);

//ctx.state.cards[0].damage++;

const card = ctx.cardList.get(1)!;

autorun(() => {
  console.log('props', toJS(card.props));
});

ctx.state.effects.push({
  card: 1,
  mod: {
    prop: 'attack',
    inc: { count: 'damage', target: 1 },
  },
});

ctx.state.effects.push({
  card: 1,
  mod: {
    type: 'enemy',
  },
});

ctx.state.effects.push({
  card: 1,
  mod: {
    prop: 'attack',
    inc: {
      count: {
        type: 'enemy',
      },
    },
  },
});

card.state.damage = 2;

ctx.state.cards.set(2, {
  id: 2,
  damage: 0,
  printed: { attack: 1, defense: 1, type: 'enemy' },
});

console.log(ctx.view);

console.log(getDependencyTree(ctx, 'view'));
