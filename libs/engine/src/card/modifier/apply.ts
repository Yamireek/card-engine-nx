import { CardView, CardModifier } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { CardId, keys } from '@card-engine-nx/basic';
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

  if ('nextStage' in modifier) {
    self.nextStage = modifier.nextStage;
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

  if ('whenRevealed' in modifier) {
    self.whenRevealed.push({
      description: modifier.description,
      action: modifier.whenRevealed,
    });
    return;
  }

  if ('conditional' in modifier) {
    if (modifier.conditional.advance !== undefined) {
      self.conditional.advance.push(modifier.conditional.advance);
    }
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

  if ('refreshCost' in modifier) {
    self.refreshCost.push(modifier.refreshCost);
    return;
  }

  if ('replaceType' in modifier) {
    self.props.type = modifier.replaceType;
    return;
  }

  if ('addTrait' in modifier) {
    self.props.traits.push(modifier.addTrait);
    return;
  }

  if ('travel' in modifier) {
    self.travel.push(modifier.travel);
    return;
  }

  if ('rule' in modifier) {
    self.rules = { ...self.rules, ...modifier.rule }; // TODO better merge with arrays
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

  if ('addSphere' in modifier) {
    if (!self.props.sphere) {
      self.props.sphere = [modifier.addSphere];
    } else {
      self.props.sphere.push(modifier.addSphere);
    }
    return;
  }

  throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}
