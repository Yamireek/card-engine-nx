export type PlayerId = '0' | '1' | '2' | '3';

export type Phase =
  | 'setup'
  | 'resource'
  | 'planning'
  | 'quest'
  | 'travel'
  | 'encounter'
  | 'combat'
  | 'refresh';

export type Token = 'damage' | 'progress' | 'resources';

export type CardType =
  | 'hero'
  | 'ally'
  | 'quest'
  | 'attachment'
  | 'enemy'
  | 'event'
  | 'treachery'
  | 'location'
  | 'quest'
  | 'player_back'
  | 'encounter_back'
  | 'shadow';

export type Mark = 'questing' | 'attacked' | 'attacking' | 'defending' | string;

export type GameZoneType =
  | 'discardPile'
  | 'stagingArea'
  | 'activeLocation'
  | 'encounterDeck'
  | 'questDeck'
  | 'questArea'
  | 'victoryDisplay'
  | 'removed';

export type PlayerZoneType =
  | 'hand'
  | 'library'
  | 'discardPile'
  | 'playerArea'
  | 'engaged';

export type ZoneType = GameZoneType | PlayerZoneType;

export type Side = 'front' | 'back' | 'shadow';

export type Trait =
  | 'dwarf'
  | 'noble'
  | 'warrior'
  | 'gondor'
  | 'title'
  | 'noldor'
  | 'rohan'
  | 'dúnedain'
  | 'ranger'
  | 'creature'
  | 'spider'
  | 'forest'
  | 'dolGuldur'
  | 'orc'
  | 'goblin'
  | 'mountain'
  | 'stronghold'
  | 'insect'
  | 'silvan'
  | 'beorning'
  | 'archer'
  | 'artifact'
  | 'weapon'
  | 'item'
  | 'armor'
  | 'istari'
  | 'condition'
  | 'steward'
  | 'trap'
  | 'skill'
  | 'scout'
  | 'hobbit'
  | 'craftsman'
  | 'minstrel';

export type Sphere = 'tactics' | 'spirit' | 'lore' | 'leadership' | 'neutral';

export type Orientation = 'landscape' | 'portrait';

export type CardNumProp = 'attack' | 'defense' | 'willpower';

export type Difficulty = 'easy' | 'normal';

export type LimitType = 'round' | 'phase';

export type Until = 'end_of_phase' | 'end_of_round';
