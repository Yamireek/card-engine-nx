export type PlayerId = "A" | "B" | "C" | "D";

export type Phase =
  | "setup"
  | "resource"
  | "planning"
  | "quest"
  | "travel"
  | "encounter"
  | "combat"
  | "refresh";

export type Token = "damage" | "progress" | "resources";

export type CardType =
  | "hero"
  | "ally"
  | "quest"
  | "attachment"
  | "enemy"
  | "event"
  | "treachery"
  | "location"
  | "quest";

export type Mark = "questing" | "attacked" | "attacking" | "defending";

export type GameZoneType =
  | "discardPile"
  | "stagingArea"
  | "activeLocation"
  | "encounterDeck"
  | "questDeck"
  | "victoryDisplay";

export type PlayerZoneType =
  | "hand"
  | "library"
  | "discardPile"
  | "playerArea"
  | "engaged";

export type Side = "face" | "back";

export type Trait =
  | "dwarf"
  | "noble"
  | "warrior"
  | "gondor"
  | "title"
  | "noldor"
  | "rohan"
  | "d鷑edain"
  | "ranger"
  | "creature"
  | "spider"
  | "forest"
  | "dolGuldur"
  | "orc"
  | "goblin"
  | "mountain"
  | "stronghold"
  | "insect"
  | "silvan"
  | "beorning"
  | "archer"
  | "artifact"
  | "weapon"
  | "item"
  | "armor"
  | "istari";

export type Sphere = "tactics" | "spirit" | "lore" | "leadership" | "neutral";

export type Orientation = "landscape" | "portrait";

export type Keywords = {
  ranged: boolean;
  sentinel: boolean;
};
