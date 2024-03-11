import { NumberExpr, Scope } from '@card-engine-nx/state';
import { getTargetCards } from '../../card/target/multi';
import { calculateCardExpr } from '../../card/expression/number/calculate';
import { sum } from 'lodash';
import { ViewContext } from '../../context/view';
import { last, min, multiply } from 'lodash/fp';
import { getTargetPlayers } from '../../player/target/multi';
import { calculatePlayerExpr } from '../../player/expression/calculate';
import { calculateBoolExpr } from '../bool/calculate';
import { getFromScope } from '../../scope/utils';

export function calculateNumberExpr(
  expr: NumberExpr,
  ctx: ViewContext,
  scopes: Scope[]
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'countOfPlayers') {
    return Object.keys(ctx.state.players).length;
  }

  if (expr === 'totalThreat') {
    const values = ctx.state.zones.stagingArea.cards
      .map((c) => ctx.state.cards[c])
      .map((v) =>
        v.view.rules.noThreatContribution ? 0 : v.view.props.threat ?? 0
      );
    return sum(values);
  }

  if (expr === 'X') {
    const x = getFromScope(ctx, scopes, (s) => s.x);
    if (x === undefined) {
      throw new Error('no x value');
    }
    return x;
  }

  if (expr.card) {
    const ids = getTargetCards(expr.card.target, ctx, scopes);
    if (ids.length === 1) {
      return calculateCardExpr(expr.card.value, ids[0], ctx);
    } else {
      if (expr.card.sum) {
        return sum(
          ids.map((id) => calculateCardExpr(expr.card?.value || 0, id, ctx))
        );
      } else {
        throw new Error('multiple card');
      }
    }
  }

  if (expr.player) {
    const ids = getTargetPlayers(expr.player.target, ctx, scopes);
    if (ids.length === 1) {
      return calculatePlayerExpr(expr.player.value, ids[0], ctx, scopes);
    } else {
      throw new Error('multiple players card');
    }
  }

  if (expr.event) {
    const event = last(ctx.state.event);

    if (!event) {
      throw new Error('no active event');
    }

    if (expr.event.type === event.type) {
      if (expr.event.type === 'receivedDamage') {
        if (expr.event.value === 'damage') {
          return event.damage;
        }
      }
    }
  }

  if (expr.plus) {
    const values = expr.plus.map((e) => calculateNumberExpr(e, ctx, scopes));
    return sum(values) ?? 0;
  }

  if (expr.minus) {
    const a = calculateNumberExpr(expr.minus[0], ctx, scopes);
    const b = calculateNumberExpr(expr.minus[1], ctx, scopes);
    return a - b;
  }

  if (expr.multiply) {
    const values = expr.multiply.map((e) =>
      calculateNumberExpr(e, ctx, scopes)
    );
    return multiply(values[0], values[1]) ?? 0;
  }

  if (expr.if) {
    const result = calculateBoolExpr(expr.if.cond, ctx, scopes);
    if (result) {
      return calculateNumberExpr(expr.if.true, ctx, scopes);
    } else {
      return calculateNumberExpr(expr.if.false, ctx, scopes);
    }
  }

  if (expr.count) {
    if (expr.count.cards) {
      const cards = getTargetCards(expr.count.cards, ctx, scopes);
      return cards.length;
    }
  }

  if (expr.min) {
    const values = expr.min.map((v) => calculateNumberExpr(v, ctx, scopes));
    const minimun = min(values);
    if (minimun === undefined) {
      throw new Error('no values');
    }
    return minimun;
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}
