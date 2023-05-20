import {
  CardId,
  CardNumProp,
  Orientation,
  PlayerId,
  PrintedProps,
  Token,
} from '@card-engine-nx/basic';
import { Types } from './types';

export type CardDefinition<T extends Types = Types> = {
  front: PrintedProps & { abilities: T['Ability'][] };
  back: PrintedProps & { abilities: T['Ability'][] };
  orientation: Orientation;
};

export interface GameAlg<T extends Types> {
  seq(a: T['Action'][]): T['Action'];

  addCard(def: CardDefinition<T>): T['Action'];
}

export interface AbilityAlg<T extends Types> {
  selfModifier(params: {
    description: string;
    modifier: T['Modifier'];
  }): T['Ability'];
}

export interface ModifierAlg<T extends Types> {
  increment(prop: CardNumProp, amount: T['Num']): T['Modifier'];
}

export interface ExprAlg<T extends Types> {
  bool(v: boolean): T['Bool'];
  and(v: T['Bool'][]): T['Bool'];
  or(v: T['Bool'][]): T['Bool'];

  num(value: number): T['Num'];
  sum(values: T['Num'][]): T['Num'];
}

export interface PlayerAlg<T extends Types> {
  action(target: T['PlayerTarget'], action: T['PlayerAction']): T['Action'];

  seq(a: T['PlayerAction'][]): T['PlayerAction'];
  draw(amount: T['Num']): T['PlayerAction'];
  incThreat(amount: T['Num']): T['PlayerAction'];

  id(id: PlayerId): T['PlayerTarget'];
  each(): T['PlayerTarget'];
}

export interface CardAlg<T extends Types> {
  action(target: T['CardTarget'], action: T['CardAction']): T['Action'];
  num(num: T['CardNum'], target: T['CardTarget']): T['Num'];

  seq(a: T['CardAction'][]): T['CardAction'];

  each(): T['CardTarget'];
  id(id: CardId): T['CardTarget'];
  self(): T['CardTarget'];

  prop(prop: CardNumProp): T['CardNum'];
  count(type: Token): T['CardNum'];
}

export type Alg<T extends Types> = GameAlg<T> &
  ExprAlg<T> & {
    player: PlayerAlg<T>;
    card: CardAlg<T>;
    ability: AbilityAlg<T>;
    mod: ModifierAlg<T>;
  };
