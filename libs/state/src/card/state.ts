import {
  CardId,
  Side,
  PlayerId,
  Marks,
  Tokens,
  Keywords,
  ZoneId,
} from '@card-engine-nx/basic';
import { CardDefinition } from '../definitions/types';
import { CardView } from './view';

export type CardState = {
  id: CardId;
  view: CardView;
  definition: CardDefinition;
  sideUp: Side;
  tapped: boolean;
  token: Tokens;
  mark: Marks;
  attachments: CardId[];
  attachedTo?: CardId;
  owner: PlayerId | undefined;
  controller: PlayerId | undefined;
  limitUses: {
    phase: Record<string, number>;
    round: Record<string, number>;
  };
  keywords: Keywords;
  zone: ZoneId;
  shadows: CardId[];
  shadowOf?: CardId;
};
