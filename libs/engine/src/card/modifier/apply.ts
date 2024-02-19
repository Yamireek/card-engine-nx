import { CardView, CardModifier, mergeCardRules } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import {
  CardId,
  keys,
  mergeArrays as appendToArray,
  mergeKeywords,
} from '@card-engine-nx/basic';
import { calculateCardBoolExpr } from '../expression/bool/calculate';
import { calculateNumberExpr } from '../../expression/number/calculate';
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

  if ('increment' in modifier) {
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

  if ('setup' in modifier) {
    ctx.view.setup.push(modifier.setup);
    return;
  }

  if ('reaction' in modifier) {
    if (!ctx.view.responses[modifier.reaction.event]) {
      ctx.view.responses[modifier.reaction.event] = [];
    }

    ctx.view.responses[modifier.reaction.event]?.push({
      source: source,
      card: self.id,
      description: modifier.description,
      action: modifier.reaction.action,
      condition: modifier.reaction.condition,
      forced: modifier.reaction.forced,
    });
    return;
  }

  if ('action' in modifier) {
    ctx.view.actions.push({
      card: self.id,
      description: modifier.description,
      action: modifier.action,
    });
    return;
  }

  if ('replaceType' in modifier) {
    self.props.type = modifier.replaceType;
    return;
  }

  if ('rules' in modifier) {
    self.rules = mergeCardRules(self.rules, modifier.rules);
    return;
  }

  if ('if' in modifier) {
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

  if ('add' in modifier) {
    if (modifier.add.sphere) {
      self.props.sphere = appendToArray(self.props.sphere, modifier.add.sphere);
    }

    if (modifier.add.trait) {
      self.props.traits = appendToArray(self.props.traits, modifier.add.trait);
    }

    if (modifier.add.keyword) {
      self.props.keywords = mergeKeywords(
        self.props.keywords,
        modifier.add.keyword
      );
    }

    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
