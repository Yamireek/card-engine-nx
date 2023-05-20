import { gimli } from '@card-engine-nx/cards/cards-core';
import {
  ExecutorTypes,
  State,
  createState,
  toView,
} from '@card-engine-nx/state';
import { gameExecutor } from '@card-engine-nx/engine';
import { Alg, Types } from '@card-engine-nx/algebras';
import { Flavoring } from '@card-engine-nx/basic';

function execute(
  action: (alg: Alg<Types>) => Flavoring<'Action'>,
  state: State
) {
  const expr = action(gameExecutor) as ExecutorTypes['Action'];
  return expr(state, {});
}

it("Gimli's ability", () => {
  const state = createState();

  execute((g) => {
    const hero = gimli(g);
    return g.addCard(hero);
  }, state);

  state.cards[1]!.token.damage = 5;

  console.log(state);

  const view = toView(state);

  console.log(view);

  return;
});
