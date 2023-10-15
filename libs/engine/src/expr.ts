import { BoolExpr, CardBoolExpr, NumberExpr } from '@card-engine-nx/state';
import { getTargetCard, getTargetCards } from './card/target';
import { calculateCardExpr } from './card/expr';
import { sum } from 'lodash';
import { ViewContext } from './context';
import { last, max, min, multiply, values } from 'lodash/fp';
import { CardId } from '@card-engine-nx/basic';
import { isInPlay } from './utils';
import { getZoneType } from './zone/target';

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

  if (expr === 'totalThreat') {
    const values = ctx.state.zones.stagingArea.cards
      .map((c) => ctx.view.cards[c])
      .map((v) => (v.rules.noThreatContribution ? 0 : v.props.threat ?? 0));
    return sum(values);
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
    const values = expr.plus.map((e) => calculateNumberExpr(e, ctx));
    return sum(values) ?? 0;
  }

  if (expr.multiply) {
    const values = expr.multiply.map((e) => calculateNumberExpr(e, ctx));
    return multiply(values[0], values[1]) ?? 0;
  }

  if (expr.if) {
    const result = calculateBoolExpr(expr.if.cond, ctx);
    if (result) {
      return calculateNumberExpr(expr.if.true, ctx);
    } else {
      return calculateNumberExpr(expr.if.false, ctx);
    }
  }

  if (expr.count) {
    if (expr.count.cards) {
      const cards = getTargetCards(expr.count.cards, ctx);
      return cards.length;
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

  if (expr === 'in_a_play') {
    const zone = ctx.state.cards[cardId].zone;
    return isInPlay(getZoneType(zone));
  }

  if (expr.hasTrait) {
    const traits = ctx.view.cards[cardId].props.traits;
    return traits?.includes(expr.hasTrait) ?? false;
  }

  if (expr.hasMark) {
    const mark = ctx.state.cards[cardId].mark;
    return mark[expr.hasMark];
  }

  if (expr.is) {
    const target = getTargetCard(expr.is, ctx);
    return target === cardId;
  }

  if (expr.isType) {
    const type = ctx.view.cards[cardId].props.type;

    if (expr.isType === 'character' && (type === 'ally' || type === 'hero')) {
      return true;
    } else {
      return expr.isType === type;
    }
  }

  if (expr.name) {
    return ctx.view.cards[cardId].props.name === expr.name;
  }

  if (expr.zone) {
    return ctx.state.cards[cardId].zone === expr.zone;
  }

  if (expr.and) {
    return expr.and.every((e) => calculateCardBoolExpr(e, cardId, ctx));
  }

  if (expr.global) {
    return calculateBoolExpr(expr.global, ctx);
  }

  throw new Error(`unknown card bool expression: ${JSON.stringify(expr)}`);
}
