import { CardView, CardModifier } from '@card-engine-nx/state';
import { ViewContext } from '../context';
import { CardId, keys } from '@card-engine-nx/basic';
import { calculateNumberExpr } from '../expr';

export function applyModifier(
  modifier: CardModifier,
  self: CardView,
  source: CardId,
  ctx: ViewContext
) {
  if (source !== self.id && source !== 0) {
    self.effects.push(
      `[${ctx.view.cards[source].props.name}] ${modifier.description}`
    );
  }

  if (source === 0) {
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
        description: modifier.description,
        action: modifier.reaction.action,
        condition: modifier.reaction.condition,
        forced: modifier.reaction.forced,
      });
      return;

    case !!modifier.whenRevealed: {
      self.whenRevealed.push({
        description: modifier.description,
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
        description: modifier.description,
        action: modifier.action,
      });
      return;

    case !!modifier.refreshCost:
      self.refreshCost.push(modifier.refreshCost);
      return;

    case !!modifier.type:
      self.props.type = modifier.type;
      return;

    case !!modifier.trait:
      self.props.traits.push(modifier.trait);
      return;

    case !!modifier.travel:
      self.travel.push(modifier.travel);
      return;

    default:
      throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
  }
}
