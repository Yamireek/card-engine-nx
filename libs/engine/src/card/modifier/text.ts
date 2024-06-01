import { keys } from '@card-engine-nx/basic';
import { CardModifier } from '@card-engine-nx/state';
import { getNumberExprText } from '../../expression/number/text';

export function getCardModifierText(modifier: CardModifier): string {
  if ('increment' in modifier) {
    const increment = modifier.increment;
    return (
      'has ' +
      keys(modifier.increment)
        .flatMap((property) => {
          const expr = increment[property];
          if (typeof expr === 'number') {
            if (expr === 0) {
              return;
            }
            return `${expr > 0 ? '+' : '-'}${expr} [${property}]`;
          } else {
            if (expr !== undefined) {
              return `[${property}] incremented by ${getNumberExprText(expr)}`;
            }
          }
        })
        .join(', ')
    );
  }

  if ('disable' in modifier) {
    if (modifier.disable === 'attacking') {
      return "can't attack";
    }
  }

  if ('addSphere' in modifier) {
    return `gains [${modifier.addSphere}] resource icon`;
  }

  if ('rules' in modifier) {
    if (modifier.rules.attacksStagingArea) {
      return 'can attack enemies in stagin area';
    }

    if (modifier.rules.noThreatContribution) {
      return "does not contribute it's threat";
    }
  }

  return JSON.stringify(modifier, null, 1);
}
