import { HeroProps } from '@card-engine-nx/basic';
import { Alg, CardDefinition } from './algebras';
import { Types } from './types';

export function createAction<T extends Types>(
  factory: (alg: Alg<T>) => T['Action']
): (alg: Alg<T>) => T['Action'] {
  return factory;
}

export function createHero<T extends Types>(
  props: Omit<HeroProps, 'type'>,
  factory: (alg: Alg<T>) => T['Ability'][]
): (alg: Alg<T>) => CardDefinition<T> {
  return (alg) => {
    const abilities = factory(alg);
    return {
      front: {
        ...props,
        abilities,
        type: 'hero',
      },
      back: {
        type: 'empty',
        abilities,
      },
      orientation: 'portrait',
    };
  };
}
