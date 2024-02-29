import { asArray, keys, zonesEqual } from '@card-engine-nx/basic';
import { CardState, CardTarget, CardView, Scope } from '@card-engine-nx/state';
import { intersection, last } from 'lodash';
import { ViewContext } from '../../context/view';
import { getZoneType } from '../../zone/utils';
import { isArray } from 'lodash/fp';
import { calculateBoolExpr } from '../../expression/bool/calculate';
import { calculateNumberExpr } from '../../expression/number/calculate';
import { getCardFromScope } from '../../scope/getCard';
import { getTargetPlayers } from '../../player/target/multi';
import { isInPlay } from '../../zone/utils';
import { getTargetCards } from '../target/multi';

export function checkCardPredicate(
  target: CardTarget,
  state: CardState,
  view: CardView,
  ctx: ViewContext,
  scopes: Scope[]
): boolean {
  if (typeof target === 'number') {
    return state.id === target;
  }

  if (isArray(target)) {
    return target.includes(state.id);
  }

  if (typeof target !== 'string' && Object.keys(target).length > 1) {
    return keys(target).every((key) =>
      checkCardPredicate({ [key]: target[key] }, state, view, ctx, scopes)
    );
  }

  if (target === 'self' || target === 'target') {
    const ids = getCardFromScope(ctx, scopes, target);
    return (ids && ids.includes(state.id)) ?? false;
  }

  if (target === 'each') {
    return true;
  }

  if (target === 'inAPlay') {
    return isInPlay(getZoneType(state.zone));
  }

  if (target === 'character') {
    return view.props.type === 'ally' || view.props.type === 'hero';
  }

  if (target === 'ready') {
    return !state.tapped;
  }

  if (target === 'event') {
    const event = last(ctx.state.event);
    if (event && 'card' in event) {
      return event.card === state.id;
    } else {
      return false;
    }
  }

  if (target === 'exhausted') {
    return state.tapped;
  }

  if (target === 'destroyed') {
    const hitpoints = view.props.hitPoints;
    return hitpoints !== undefined && hitpoints <= state.token.damage;
  }

  if (target === 'explored') {
    const need = view.props.questPoints;
    const expr = view.rules.conditional?.advance ?? [];
    const allowed =
      expr.length > 0 ? calculateBoolExpr({ and: expr }, ctx, scopes) : true;
    return need !== undefined && allowed && need <= state.token.progress;
  }

  if (target === 'isAttached') {
    return !!state.attachedTo;
  }

  if (target === 'isShadow') {
    return !!state.shadowOf;
  }

  if (target.simple) {
    return asArray(target.simple).every((s) =>
      checkCardPredicate(s, state, view, ctx, scopes)
    );
  }

  if (target.and) {
    return target.and.every((p) =>
      checkCardPredicate(p, state, view, ctx, scopes)
    );
  }

  if (target.not) {
    return !checkCardPredicate(target.not, state, view, ctx, scopes);
  }

  if (target.owner) {
    if (!state.owner) {
      return false;
    }

    const players = getTargetPlayers(target.owner, ctx, scopes);
    return players.includes(state.owner);
  }

  if (target.type) {
    return asArray(target.type).includes(view.props.type);
  }

  if (target.sequence) {
    const value = calculateNumberExpr(target.sequence, ctx, scopes);
    return value === view.props.sequence;
  }

  if (target.sphere) {
    if (target.sphere === 'any') {
      return (
        view.props.sphere !== undefined &&
        view.props.sphere.length > 0 &&
        !view.props.sphere.includes('neutral')
      );
    }

    const spheres = asArray(target.sphere);

    return view.props.sphere?.some((s) => spheres.includes(s)) ?? false;
  }

  if (target.controller) {
    if (!state.controller) {
      return false;
    }

    const players = getTargetPlayers(target.controller, ctx, scopes);
    return players.includes(state.controller);
  }

  if (target.mark) {
    return state.mark[target.mark];
  }

  if (target.trait) {
    return view.props.traits.includes(target.trait);
  }

  if (target.zone) {
    return zonesEqual(target.zone, state.zone);
  }

  if (target.zoneType) {
    const type = getZoneType(state.zone);
    return target.zoneType.includes(type);
  }

  if (target.hasAttachment) {
    const attachments = getTargetCards(target.hasAttachment, ctx, scopes);
    return intersection(attachments, state.attachments).length > 0;
  }

  if (target.shadows) {
    if (!state.shadowOf) {
      return false;
    }

    const targets = getTargetCards(target.shadows, ctx, scopes);
    return targets.includes(state.shadowOf);
  }

  if (target.keyword) {
    return (
      (view.props.keywords && view.props.keywords[target.keyword]) ?? false
    );
  }

  if (target.name) {
    return (
      state.definition.front.name === target.name ||
      state.definition.back.name === target.name
    );
  }

  if (target.event === 'attacking') {
    const event = last(ctx.state.event);
    if (event?.type === 'declaredAsDefender') {
      return event.attacker === state.id;
    } else {
      return false;
    }
  }

  if (target.side) {
    return target.side === state.sideUp;
  }

  if (target.hasShadow) {
    const shadows = getTargetCards(target.hasShadow, ctx, scopes);
    return state.shadows.some((s) => shadows.includes(s));
  }

  if (target.attachmentOf) {
    if (!state.attachedTo) {
      return false;
    }

    const targets = getTargetCards(target.attachmentOf, ctx, scopes);
    return targets.includes(state.attachedTo);
  }

  if (target.var) {
    const vars = getCardFromScope(ctx, scopes, target.var);
    return (vars && vars.includes(state.id)) ?? false;
  }

  throw new Error(`unknown card predicate: ${JSON.stringify(target)}`);
}
