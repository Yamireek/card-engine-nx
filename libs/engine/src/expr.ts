import { BoolExpr, CardBoolExpr, NumberExpr } from '@card-engine-nx/state';
import { getTargetCards } from './card/target';
import { calculateCardExpr } from './card/expr';
import { sum } from 'lodash';
import { ExecutionContext, ViewContext } from './context';
import { max, min, values } from 'lodash/fp';
import { CardId } from '@card-engine-nx/basic';

export function calculateNumberExpr(
  expr: NumberExpr,
  ctx: ViewContext
): number {
  if (typeof expr === 'number') {
    return expr;
  }

  if (expr === 'countOfPlayers') {
    return Object.keys(ctx.state.players).length;
  }

  if (expr.card) {
    const ids = getTargetCards(expr.card.target, ctx);
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

  if (expr.event) {
    if (ctx.state.event === 'none' || !ctx.state.event) {
      throw new Error('no active event');
    }

    if (expr.event.type === ctx.state.event.type) {
      if (expr.event.type === 'receivedDamage') {
        if (expr.event.value === 'damage') {
          return ctx.state.event.damage;
        }
      }
    }
  }

  if (expr.plus) {
    const values = expr.plus.map((e) => calculateNumberExpr(e, ctx));
    return sum(values) ?? 0;
  }

  if (expr.if) {
    const result = calculateBoolExpr(expr.if.cond, ctx);
    if (result) {
      return calculateNumberExpr(expr.if.true, ctx);
    } else {
      return calculateNumberExpr(expr.if.false, ctx);
    }
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}

export function calculateBoolExpr(expr: BoolExpr, ctx: ViewContext): boolean {
  if (typeof expr === 'boolean') {
    return expr;
  }

  if (expr === 'enemiesToEngage') {
    // TODO use exprs
    const playerThreats = values(ctx.state.players).map((p) => p.thread);

    const enemies = getTargetCards(
      {
        and: [{ type: 'enemy' }, { zone: 'stagingArea' }],
      },
      ctx
    );

    const enemyEngagements = enemies
      .map((e) => ctx.view.cards[e])
      .flatMap((e) => (e.props.engagement ? [e.props.engagement] : []));

    const minEng = min(enemyEngagements);
    const maxEng = max(playerThreats);

    if (minEng === undefined || maxEng === undefined) {
      return false;
    }

    return minEng <= maxEng;
  }

  if (expr.phase) {
    return ctx.state.phase === expr.phase;
  }

  if (expr.someCard) {
    const ids = getTargetCards(expr.someCard, ctx);
    return ids.length > 0;
  }

  if (expr.card) {
    const target = getTargetCards(expr.card.target, ctx);
    if (target.length === 0) {
      return false;
    }

    if (target.length === 1) {
      return calculateCardBoolExpr(expr.card.value, target[0], ctx);
    }
  }

  if (expr.and) {
    return expr.and.every((e) => calculateBoolExpr(e, ctx));
  }

  throw new Error(`unknown bool expression: ${JSON.stringify(expr)}`);
}

export function calculateCardBoolExpr(
  expr: CardBoolExpr,
  cardId: CardId,
  ctx: ViewContext
): boolean {
  if (typeof expr === 'boolean') {
    return expr;
  }

  if (expr.hasTrait) {
    const traits = ctx.view.cards[cardId].props.traits;
    return traits?.includes(expr.hasTrait) ?? false;
  }

  if (expr.hasMark) {
    const mark = ctx.state.cards[cardId].mark;
    return mark[expr.hasMark];
  }

  throw new Error(`unknown card bool expression: ${JSON.stringify(expr)}`);
}
