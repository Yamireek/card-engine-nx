import { Action } from '../action';
import { EventType } from '../event/type';
import { BoolExpr } from '../expression/bool';

export type ResponseAction = {
  event: EventType;
  condition?: BoolExpr;
  action: Action;
};
