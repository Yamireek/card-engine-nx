import {
  CardId,
  CardType,
  GameZoneType,
  Keywords,
  Mark,
  PlayerZoneType,
  Side,
  Sphere,
  Trait,
  ZoneId,
} from '@card-engine-nx/basic';
import { NumberExpr } from '../expression/number';
import { PlayerTarget } from '../player/target';
import { ZoneTarget } from '../zone/target';

export type SimpleCardTarget =
  | 'self'
  | 'each'
  | 'inAPlay'
  | 'character'
  | 'ready'
  | 'event'
  | 'exhausted'
  | 'target'
  | 'destroyed'
  | 'explored'
  | 'isAttached'
  | 'isShadow';

export type CardTarget =
  | SimpleCardTarget
  | CardId
  | CardId[]
  | {
      name?: string;
      owner?: PlayerTarget;
      simple?: SimpleCardTarget | SimpleCardTarget[];
      and?: CardTarget[];
      not?: CardTarget;
      type?: CardType | CardType[];
      top?:
        | ZoneTarget
        | { zone: ZoneTarget; amount: NumberExpr; filter?: CardTarget };
      sphere?: Sphere | Sphere[] | 'any';
      controller?: PlayerTarget;
      mark?: Mark;
      trait?: Trait;
      zone?: ZoneId;
      zoneType?:
        | PlayerZoneType
        | GameZoneType
        | Array<PlayerZoneType | GameZoneType>;
      sequence?: NumberExpr;
      hasAttachment?: CardTarget;
      attachmentOf?: CardTarget;
      hasShadow?: CardTarget;
      keyword?: keyof Keywords;
      var?: string;
      event?: 'attacking';
      take?: number;
      side?: Side;
      shadows?: CardTarget;
    };
