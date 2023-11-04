import { Action } from '../action';
import { BoolExpr } from '../expression/bool';
import { EventType } from '../event/type';

export type ResponseAction = {
  event: EventType;
  condition?: BoolExpr;
  action: Action;
};
