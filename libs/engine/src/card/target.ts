import {
  CardId,
  GameZoneType,
  PlayerZoneType,
  values,
} from '@card-engine-nx/basic';
import { CardTarget } from '@card-engine-nx/state';
import { intersection, last, uniq } from 'lodash';
import { ViewContext, cardIds } from '../context';
import { getTargetZone, getZoneState } from '../zone/target';
import { canCardExecute } from '../resolution';
import { difference, isArray } from 'lodash/fp';
import { calculateNumberExpr } from '../expr';

export function getTargetCard(target: CardTarget, ctx: ViewContext): CardId[] {
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

  if (target.and) {
    const lists = target.and.map((t) => getTargetCard(t, ctx));
    return uniq(intersection(...lists));
  }

  if (target.not) {
    const valid = getTargetCard(target.not, ctx);
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
    return values(ctx.view.cards)
      .filter((c) => target.type?.includes(c.props.type))
      .map((s) => s.id);
  }

  if (target.sequence) {
    const value = calculateNumberExpr(target.sequence, ctx);
    return values(ctx.view.cards)
      .filter((c) => value === c.props.sequence)
      .map((s) => s.id);
  }

  if (target.top) {
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

  if (target.canExecute) {
    const action = target.canExecute;
    return cardIds(ctx).filter((id) => canCardExecute(action, id, ctx));
  }

  if (target.controller) {
    const player = ctx.state.players[target.controller];
    return player?.zones.playerArea.cards ?? [];
  }

  if (target.mark) {
    const type = target.mark;
    return values(ctx.state.cards)
      .filter((c) => c.mark[type])
      .map((c) => c.id);
  }

  if (target.zone) {
    const zone = getZoneState(target.zone, ctx.state);
    return zone.cards;
  }

  throw new Error(`unknown card target: ${JSON.stringify(target)}`);
}
