import { Scope, ZoneTarget } from '@card-engine-nx/state';
import { ViewContext } from '../../context/view';
import { getTargetZones } from './multi';

export function getTargetZone(target: ZoneTarget, ctx: ViewContext) {
  const zones = getTargetZones(target, ctx);
  if (zones.length <= 1) {
    return zones[0];
  } else {
    throw new Error('unexpected result count');
  }
}
