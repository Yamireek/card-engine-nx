import { BoolExpr, NumberExpr } from '@card-engine-nx/state';
import { getTargetCard } from './card/target';
import { calculateCardExpr } from './card/expr';
import { sum } from 'lodash';
import { ExecutionContext, ViewContext } from './context';
import { max, min, values } from 'lodash/fp';

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

  if (expr.fromCard) {
    const ids = getTargetCard(expr.fromCard.card, ctx);
    if (ids.length === 1) {
      return calculateCardExpr(expr.fromCard.value, ids[0], ctx);
    } else {
      if (expr.fromCard.sum) {
        return sum(
          ids.map((id) => calculateCardExpr(expr.fromCard?.value || 0, id, ctx))
        );
      } else {
        throw new Error('multiple card');
      }
    }
  }

  if (expr.fromEvent) {
    if (ctx.state.event === 'none' || !ctx.state.event) {
      throw new Error('no active event');
    }

    if (expr.fromEvent.type === ctx.state.event.type) {
      if (expr.fromEvent.type === 'receivedDamage') {
        if (expr.fromEvent.value === 'damage') {
          return ctx.state.event.damage;
        }
      }
    }
  }

  if (expr.plus) {
    const values = expr.plus.map((e) => calculateNumberExpr(e, ctx));
    return sum(values) ?? 0;
  }

  throw new Error(`unknown number expression: ${JSON.stringify(expr)}`);
}

export function calculateBoolExpr(
  expr: BoolExpr,
  ctx: ExecutionContext
): boolean {
  if (typeof expr === 'boolean') {
    return expr;
  }

  if (expr === 'enemiesToEngage') {
    // TODO use exprs
    const playerThreats = values(ctx.state.players).map((p) => p.thread);

    const enemies = getTargetCard(
      {
        and: [
          { type: ['enemy'] },
          { zone: { owner: 'game', type: 'stagingArea' } },
        ],
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
    const ids = getTargetCard(expr.someCard, ctx);
    return ids.length > 0;
  }

  throw new Error(`unknown bool expression: ${JSON.stringify(expr)}`);
}
