import { Alg, Types } from '@card-engine-nx/algebras';
import { cardExecutor } from './card';
import { playerExecutor } from './player';
import { ExecutorTypes, createCardState } from '@card-engine-nx/state';

export const gameExecutor: Alg<Types & ExecutorTypes> = {
  and(v) {
    throw new Error();
  },
  or(v) {
    throw new Error();
  },
  sum(values) {
    throw new Error();
  },
  bool(v) {
    throw new Error();
  },
  num(value) {
    return () => value;
  },
  seq(a) {
    throw new Error();
  },
  addCard(def) {
    return (state) => {
      const id = state.nextId;
      state.cards[id] = createCardState(id, def, 'front', 'game');
    };
  },
  card: cardExecutor,
  player: playerExecutor,
  ability: {
    selfModifier(params) {
      return (state, card) => {
        card.modifiers.push({
          applied: false,
          description: params.description,
          modifier: params.modifier,
        });
      };
    },
  },
  mod: {
    increment(prop, amount) {
      return (state, card, ctx) => {
        const value = card.props[prop];
        if (value !== undefined) {
          card.props[prop] = value + amount(state, ctx);
        }
      };
    },
  },
};
