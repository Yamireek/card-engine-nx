import {
  CardId,
  GameZoneType,
  PlayerZoneType,
  getZoneType,
  values,
} from '@card-engine-nx/basic';
import { CardTarget } from '@card-engine-nx/state';
import { intersection, last, uniq } from 'lodash';
import { ViewContext, cardIds } from '../context';
import { getTargetZone, getZoneState } from '../zone/target';
import { difference, isArray, takeRight } from 'lodash/fp';
import { calculateNumberExpr } from '../expr';
import { getTargetPlayers } from '../player/target';

export function getTargetCard(
  target: CardTarget,
  ctx: ViewContext
): CardId | undefined {
  const results = getTargetCards(target, ctx);
  if (results.length <= 1) {
    return results[0];
  } else {
    throw new Error('unexpected result count');
  }
}

export function getTargetCards(target: CardTarget, ctx: ViewContext): CardId[] {
  if (typeof target === 'number') {
    return [target];
  }

  if (target === 'self') {
    if (ctx.card['self']) {
      return [ctx.card['self']];
    } else if (ctx.state.vars.card['self']) {
      return [ctx.state.vars.card['self']];
    } else {
      throw new Error('no self card in context');
    }
  }

  if (target === 'each') {
    return cardIds(ctx);
  }

  if (target === 'inAPlay') {
    const gameZones: GameZoneType[] = ['activeLocation', 'stagingArea'];
    const playerzones: PlayerZoneType[] = ['playerArea', 'engaged'];

    const gameIds = gameZones
      .map((z) => ctx.state.zones[z])
      .flatMap((z) => z.cards);

    const playerIds = playerzones.flatMap((z) =>
      values(ctx.state.players).flatMap((p) => p.zones[z].cards)
    );

    return [...gameIds, ...playerIds];
  }

  if (target === 'character') {
    return values(ctx.view.cards)
      .filter((c) => c.props.type === 'ally' || c.props.type === 'hero')
      .map((c) => c.id);
  }

  if (isArray(target)) {
    return target;
  }

  if (target === 'ready') {
    return values(ctx.state.cards)
      .filter((c) => !c.tapped)
      .map((c) => c.id);
  }

  if (target === 'event') {
    const event = last(ctx.state.event);
    if (
      event &&
      event.type !== 'end_of_round' &&
      event.type !== 'whenRevealed'
    ) {
      return [event.card];
    } else {
      throw new Error('no event');
    }
  }

  if (target === 'exhausted') {
    return values(ctx.state.cards)
      .filter((c) => c.tapped)
      .map((c) => c.id);
  }

  if (target === 'target') {
    const inCtx = ctx.card['target'];
    if (!inCtx) {
      const inState = ctx.state.vars.card['target'];
      if (inState) {
        return [inState];
      }
      throw new Error('no target card in ctx or state');
    } else {
      return [inCtx];
    }
  }

  if (target.take) {
    const all = getTargetCards({ ...target, take: undefined }, ctx);
    return all.slice(0, target.take);
  }

  if (target.and) {
    const lists = target.and.map((t) => getTargetCards(t, ctx));
    return uniq(intersection(...lists));
  }

  if (target.not) {
    const valid = getTargetCards(target.not, ctx);
    return difference(cardIds(ctx), valid);
  }

  if (target.owner) {
    const player = ctx.state.players[target.owner];
    if (player) {
      return values(player.zones).flatMap((z) => z.cards);
    } else {
      throw new Error('player not found');
    }
  }

  if (target.type) {
    if (isArray(target.type)) {
      return values(ctx.view.cards)
        .filter((c) => target.type?.includes(c.props.type))
        .map((s) => s.id);
    } else {
      return values(ctx.view.cards)
        .filter((c) => target.type === c.props.type)
        .map((s) => s.id);
    }
  }

  if (target.sequence) {
    const value = calculateNumberExpr(target.sequence, ctx);
    return values(ctx.view.cards)
      .filter((c) => value === c.props.sequence)
      .map((s) => s.id);
  }

  if (target.top) {
    if ('amount' in target.top) {
      const zones = getTargetZone(target.top.zone, ctx);
      if (zones.length === 1) {
        const cards = zones[0].cards;
        return takeRight(5)(cards);
      } else {
        throw new Error('need only 1 zone when using amount');
      }
    }

    const zones = getTargetZone(target.top, ctx);
    return zones.flatMap((z) => last(z.cards) ?? []);
  }

  if (target.sphere) {
    if (target.sphere === 'any') {
      return values(ctx.view.cards).map((c) => c.id);
    }

    return values(ctx.view.cards)
      .filter((c) => c.props.sphere === target.sphere)
      .map((s) => s.id);
  }

  if (target.controller) {
    const targets = getTargetPlayers(target.controller, ctx);
    return targets.flatMap(
      (t) => ctx.state.players[t]?.zones.playerArea.cards ?? []
    );
  }

  if (target.mark) {
    const type = target.mark;
    return values(ctx.state.cards)
      .filter((c) => c.mark[type])
      .map((c) => c.id);
  }

  if (target.trait) {
    const type = target.trait;
    return values(ctx.view.cards)
      .filter((c) => c.props.traits?.includes(type))
      .map((c) => c.id);
  }

  if (target.zone) {
    const zone = getZoneState(target.zone, ctx.state);
    return zone.cards;
  }

  if (target.zoneType) {
    const zones = isArray(target.zoneType)
      ? target.zoneType
      : [target.zoneType];

    return values(ctx.state.cards)
      .filter((c) => zones.includes(getZoneType(c.zone)))
      .map((c) => c.id);
  }

  if (target.hasAttachment) {
    const attachments = getTargetCards(target.hasAttachment, ctx);
    return values(ctx.state.cards)
      .filter((c) => c.attachments.some((a) => attachments.includes(a)))
      .map((c) => c.id);
  }

  if (target.enabled) {
    const type = target.enabled;
    return values(ctx.view.cards)
      .filter((c) => !c.disabled || !c.disabled[type])
      .map((c) => c.id);
  }

  if (target.keyword) {
    const type = target.keyword;
    return values(ctx.view.cards)
      .filter((c) => c.props.keywords && c.props.keywords[type])
      .map((c) => c.id);
  }

  if (target.var) {
    const card = ctx.state.vars.card[target.var];
    if (card) {
      return [card];
    } else {
      return [];
    }
  }

  if (target.name) {
    const name = target.name;
    return values(ctx.state.cards)
      .filter((c) => c.definition.front.name === name)
      .map((c) => c.id);
  }

  if (target.event === 'attacking') {
    const event = last(ctx.state.event);
    if (event?.type === 'declaredAsDefender') {
      return [event.attacker];
    } else {
      throw new Error('missing event data');
    }
  }

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
