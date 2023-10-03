import { treachery } from '@card-engine-nx/state';

export const eyesOfTheForest = treachery({ name: 'Eyes of the Forest' });
// TODO When Revealed: Each player discards all event cards in his hand.

export const caughtInAWeb = treachery({ name: 'Caught in a Web' });
// TODO When Revealed: The player with the highest threat level attaches this card to one of his heroes. (Counts as a Condition attachment with the text: 'Attached hero does not ready during the refresh phase unless you pay 2 resources from that hero's pool.')

export const drivenByShadow = treachery({ name: 'Driven by Shadow' });
// TODO When Revealed: Each enemy and each location currently in the staging area gets +1 Threat until the end of the phase. If there are no cards in the staging area, Driven by Shadow gains Surge.

export const theNecromancersReach = treachery({
  name: "The Necromancer's Reach",
});
// TODO When Revealed: Deal 1 damage to each exhausted character.
