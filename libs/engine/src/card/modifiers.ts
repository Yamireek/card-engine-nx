import { CardView, CardModifier } from '@card-engine-nx/state';
import { ViewContext } from '../context';
import { CardId, keys } from '@card-engine-nx/basic';
import {
  calculateCardBoolExpr,
  calculateNumberExpr,
  getNumberExprText,
} from '../expr';
import { isArray } from 'lodash/fp';

export function applyModifier(
  modifier: CardModifier | CardModifier[],
  self: CardView,
  source: CardId,
  ctx: ViewContext
) {
  if (isArray(modifier)) {
    for (const m of modifier) {
      applyModifier(m, self, source, ctx);
    }
    return;
  }

  if (source !== self.id && source !== 0) {
    self.effects.push(
      `[${ctx.view.cards[source].props.name}] ${modifier.description}`
    );
  }

  if (source === 0 && modifier.description) {
    self.effects.push(modifier.description);
  }

  switch (true) {
    case !!modifier.increment: {
      for (const property of keys(modifier.increment)) {
        const expr = modifier.increment[property];
        if (expr) {
          const amount = calculateNumberExpr(expr, ctx);
          const value = self.props[property];
          if (value !== undefined && amount) {
            self.props[property] = value + amount;
          }
        }
      }
      return;
    }

    case !!modifier.nextStage:
      self.nextStage = modifier.nextStage;
      return;

    case !!modifier.disable:
      if (!self.disabled) {
        self.disabled = {};
      }
      self.disabled[modifier.disable] = true;
      return;

    case !!modifier.setup:
      ctx.view.setup.push(modifier.setup);
      return;

    case !!modifier.reaction:
      if (!ctx.view.responses[modifier.reaction.event]) {
        ctx.view.responses[modifier.reaction.event] = [];
      }

      ctx.view.responses[modifier.reaction.event]?.push({
        source: source,
        card: self.id,
        description: modifier.description ?? '',
        action: modifier.reaction.action,
        condition: modifier.reaction.condition,
        forced: modifier.reaction.forced,
      });
      return;

    case !!modifier.whenRevealed: {
      self.whenRevealed.push({
        description: modifier.description ?? '',
        action: modifier.whenRevealed,
      });
      return;
    }

    case !!modifier.conditional:
      if (modifier.conditional.advance !== undefined) {
        self.conditional.advance.push(modifier.conditional.advance);
      }
      return;

    case !!modifier.action:
      ctx.view.actions.push({
        card: self.id,
        description: modifier.description ?? '',
        action: modifier.action,
      });
      return;

    case !!modifier.refreshCost:
      self.refreshCost.push(modifier.refreshCost);
      return;

    case !!modifier.replaceType:
      self.props.type = modifier.replaceType;
      return;

    case !!modifier.addTrait:
      self.props.traits.push(modifier.addTrait);
      return;

    case !!modifier.travel:
      self.travel.push(modifier.travel);
      return;

    case !!modifier.addSphere:
      if (!self.props.sphere) {
        self.props.sphere = [modifier.addSphere];
      } else {
        self.props.sphere.push(modifier.addSphere);
      }
      return;

    case !!modifier.if: {
      const condition = calculateCardBoolExpr(
        modifier.if.condition,
        self.id,
        ctx
      );

      const ifTrue = modifier.if.true;
      const ifFalse = modifier.if.false;

      if (condition && ifTrue) {
        applyModifier(ifTrue, self, source, ctx);
      }
      if (!condition && ifFalse) {
        applyModifier(ifFalse, self, source, ctx);
      }
      return;
    }

    case !!modifier.rule: {
      self.rules = { ...self.rules, ...modifier.rule };
      return;
    }

    default:
      throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
  }
}

export function getCardModifierText(modifier: CardModifier): string {
  switch (true) {
    case !!modifier.increment: {
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
                return `[${property}] incremented by ${getNumberExprText(
                  expr
                )}`;
              }
            }
          })
          .join(', ')
      );
    }

    case modifier.disable === 'attacking':
      return "can't attack";

    case !!modifier.addSphere:
      return `gains [${modifier.addSphere}] resource icon`;

    case modifier.rule?.attacksStagingArea:
      return 'can attack enemies in stagin area';

    case modifier.rule?.noThreatContribution:
      return "does not contribute it's threat";

    default:
      return JSON.stringify(modifier, null, 1);
  }
}
