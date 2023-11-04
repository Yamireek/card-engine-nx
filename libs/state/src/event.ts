import { CardId, PlayerId } from '@card-engine-nx/basic';

export type Event =
  | {
      type: 'receivedDamage';
      card: CardId;
      damage: number;
    }
  | {
      type: 'destroyed';
      card: CardId;
      attackers: CardId[];
    }
  | { type: 'declaredAsDefender'; card: CardId; attacker: CardId }
  | { type: 'enteredPlay'; card: CardId }
  | { type: 'played'; card: CardId }
  | { type: 'leftPlay'; card: CardId }
  | { type: 'revealed'; card: CardId }
  | { type: 'commits'; card: CardId }
  | { type: 'traveled'; card: CardId }
  | { type: 'engaged'; card: CardId; player: PlayerId }
  | { type: 'end_of_round' }
  | { type: 'attacked'; card: CardId }
  | { type: 'explored'; card: CardId }
  | { type: 'attacks'; card: CardId }
  | { type: 'shadow' }
  | { type: 'whenRevealed' };
