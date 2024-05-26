import { BoolExpr, Scope } from '@card-engine-nx/state';
import { getTargetCards } from '../../card/target/multi';
import { ViewContext } from '../../context/view';
import { last, max, min, values } from 'lodash/fp';
import { calculateNumberExpr } from '../number/calculate';
import { calculateCardBoolExpr } from '../../card/expression/bool/calculate';

export function calculateBoolExpr(expr: BoolExpr, ctx: ViewContext): boolean {
  if (typeof expr === 'boolean') {
    return expr;
  }

  if (expr === 'enemiesToEngage') {
    // TODO use exprs
    const playerThreats = values(ctx.state.players).map((p) => p.thread);

    const enemies = getTargetCards(
      {
        type: 'enemy',
        zone: 'stagingArea',
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

  if (expr === 'undefended.attack') {
    const defenders = getTargetCards({ mark: 'defending' }, ctx);
    return defenders.length === 0;
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

  if (expr.event) {
    const event = last(ctx.state.event);
    if (expr.event.type === event?.type) {
      if (expr.event.type === 'destroyed') {
        const target = getTargetCards(expr.event.isAttacker, ctx);
        return event.attackers.some((a) => target.includes(a));
      }
    }

    throw new Error('incorrect event type');
  }

  if (expr.not) {
    return !calculateBoolExpr(expr.not, ctx);
  }

  if (expr.eq) {
    const a = calculateNumberExpr(expr.eq[0], ctx);
    const b = calculateNumberExpr(expr.eq[1], ctx);
    return a === b;
  }

  if (expr.more) {
    const a = calculateNumberExpr(expr.more[0], ctx);
    const b = calculateNumberExpr(expr.more[1], ctx);
    return a > b;
  }

  if (expr.less) {
    const a = calculateNumberExpr(expr.less[0], ctx);
    const b = calculateNumberExpr(expr.less[1], ctx);
    return a < b;
  }

  throw new Error(`unknown bool expression: ${JSON.stringify(expr)}`);
}
