import { Flavor } from "@card-engine-nx/basic";

export type Types = {
  Action: Flavor<unknown, "Action">;
  Bool: Flavor<unknown, "Bool">;
  Num: Flavor<unknown, "Num">;

  PlayerAction: Flavor<unknown, "PlayerAction">;
  PlayerTarget: Flavor<unknown, "PlayerTarget">;

  CardAction: Flavor<unknown, "CardAction">;
  CardTarget: Flavor<unknown, "CardTarget">;
  CardNum: Flavor<unknown, "CardNum">;
};
