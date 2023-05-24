import { enemy } from '@card-engine-nx/state';

export const kingSpider = enemy({
  name: 'King Spider',
  engagement: 20,
  threat: 2,
  attack: 3,
  defense: 1,
  hitPoints: 3,
  traits: ['creature', 'spider'],
});

export const forestSpider = enemy({
  name: 'Forest Spider',
  engagement: 25,
  threat: 2,
  attack: 2,
  defense: 1,
  hitPoints: 4,
  traits: ['creature', 'spider'],
});

export const ungoliantsSpawn = enemy({
  name: "Ungoliant's Spawn",
  engagement: 32,
  threat: 3,
  attack: 5,
  defense: 2,
  hitPoints: 9,
  traits: ['creature', 'spider'],
});

export const dolGuldurOrcs = enemy({
  name: 'Dol Guldur Orcs',
  engagement: 10,
  threat: 2,
  attack: 2,
  defense: 0,
  hitPoints: 3,
  traits: ['dolGuldur', 'orc'],
});

export const chieftanUfthak = enemy({
  name: 'Chieftan Ufthak',
  engagement: 35,
  threat: 2,
  attack: 3,
  defense: 3,
  hitPoints: 6,
  victory: 4,
  traits: ['dolGuldur', 'orc'],
});

export const dolGuldurBeastmaster = enemy({
  name: 'Dol Guldur Beastmaster',
  engagement: 35,
  threat: 2,
  attack: 3,
  defense: 1,
  hitPoints: 5,
  traits: ['dolGuldur', 'orc'],
});

export const eastBightPatrol = enemy({
  name: 'East Bight Patrol',
  engagement: 5,
  threat: 3,
  attack: 3,
  defense: 1,
  hitPoints: 2,
  traits: ['goblin', 'orc'],
});

export const blackForestBats = enemy({
  name: 'Black Forest Bats',
  engagement: 15,
  threat: 1,
  attack: 1,
  defense: 0,
  hitPoints: 2,
  traits: ['creature'],
});

export const hummerhorns = enemy({
  name: 'Hummerhorns',
  engagement: 40,
  threat: 1,
  attack: 2,
  defense: 0,
  hitPoints: 3,
  victory: 5,
  traits: ['creature', 'insect'],
});

export const easternCrows = enemy({
  name: 'Eastern Crows',
  engagement: 30,
  threat: 1,
  attack: 1,
  defense: 0,
  hitPoints: 1,
  traits: ['creature'],
});
