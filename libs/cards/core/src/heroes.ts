import { ability, card, expr, modifier, target } from '@card-engine-nx/engine';
import { hero } from '@card-engine-nx/state';

export const gimli = hero(
  {
    name: 'Gimli',
    threatCost: 11,
    willpower: 2,
    attack: 2,
    defense: 2,
    hitPoints: 5,
    traits: ['dwarf', 'noble', 'warrior'],
    sphere: 'tactics',
  },
  ability.selfModifier({
    description: 'Gimli gets +1 [attack] for each damage token on him.',
    modifier: modifier.increment(
      'attack',
      expr.card(target.card.self(), card.expr.count('damage'))
    ),
  })
);
