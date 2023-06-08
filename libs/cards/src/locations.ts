import { location } from '@card-engine-nx/state';

export const greatForestWeb = location({
  name: 'Great Forest Web',
  threat: 2,
  questPoints: 2,
  traits: ['forest'],
});

export const oldForestRoad = location({
  name: 'Old Forest Road',
  threat: 1,
  questPoints: 3,
  traits: ['forest'],
});

export const forestGate = location({
  name: 'Forest Gate',
  threat: 2,
  questPoints: 4,
  traits: ['forest'],
});

export const mountainsOfMirkwood = location({
  name: 'Mountains of Mirkwood',
  threat: 2,
  questPoints: 3,
  traits: ['forest', 'mountain'],
});

export const necromancersPass = location({
  name: "Necromancer's Pass",
  threat: 3,
  questPoints: 2,
  traits: ['stronghold', 'dolGuldur'],
});

export const enchantedStream = location({
  name: 'Enchanted Stream',
  threat: 2,
  questPoints: 2,
  traits: ['forest'],
});
