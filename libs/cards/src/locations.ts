import { location } from '@card-engine-nx/state';

export const greatForestWeb = location({
  name: 'Great Forest Web',
  threat: 2,
  questPoints: 2,
  traits: ['forest'],
  // TODO Travel: Each player must exhaust 1 hero he controls to travel here.
});

export const oldForestRoad = location({
  name: 'Old Forest Road',
  threat: 1,
  questPoints: 3,
  traits: ['forest'],
  // TODO Response: After you travel to Old Forest Road the first player may choose and ready 1 character he controls.
});

export const forestGate = location({
  name: 'Forest Gate',
  threat: 2,
  questPoints: 4,
  traits: ['forest'],
  // TODO Response: After you travel to Forest Gate the first player may draw 2 cards.
});

export const mountainsOfMirkwood = location({
  name: 'Mountains of Mirkwood',
  threat: 2,
  questPoints: 3,
  traits: ['forest', 'mountain'],
  // TODO Travel: Reveal the top card of the encounter deck and add it to the staging area to travel here.
  // TODO Response: After Mountains of Mirkwood leaves play as an explored location, each player may search the top 5 cards of his deck for 1 card and add it to his hand. Shuffle the rest of the searched cards back into their owners' decks.
});

export const necromancersPass = location({
  name: "Necromancer's Pass",
  threat: 3,
  questPoints: 2,
  traits: ['stronghold', 'dolGuldur'],
  // TODO Travel: The first player must discard 2 cards from his hand at random to travel here.
});

export const enchantedStream = location({
  name: 'Enchanted Stream',
  threat: 2,
  questPoints: 2,
  traits: ['forest'],
  // TODO While Enchanted Stream is the active location, players cannot draw cards.
});
