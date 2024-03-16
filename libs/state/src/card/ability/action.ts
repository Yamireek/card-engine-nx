import { CardId } from '@card-engine-nx/basic';
import { Action } from '../../action';

export type UserCardAction = {
  description: string;
  card: CardId;
  action: Action;
};
