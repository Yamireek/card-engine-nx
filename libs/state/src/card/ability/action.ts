import { CardId } from '@card-engine-nx/basic';
import { Action } from '../../action';

export type UserCardAction = {
  card: CardId;
  description: string;
  action: Action;
  enabled?: true;
};
