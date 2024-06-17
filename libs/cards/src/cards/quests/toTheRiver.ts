import { quest } from '@card-engine-nx/state';

export const toTheRiver = quest({
  sequence: 1,
  name: 'To the River...',
  a: {
    // Setup: Each player reveals 1 card from the top of the encounter deck, and adds it to the staging area.
  },
  b: {
    questPoints: 8,
    /*
    When Revealed: Search the encounter deck for 1 Hill Troll is one is not already in play, 
    and place it in the staging area. Shuffle the encounter deck.

    Players cannot defeat this stage while any Hill Troll cards are in play.    
    */
  },
});
