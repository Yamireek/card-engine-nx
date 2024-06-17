import { quest } from '@card-engine-nx/state';

export const theNecromancersTower = quest({
  sequence: 1,
  name: "The Necromancer's Tower",
  a: {
    /*
    Setup: Search the encounter deck for the 3 objective cards, reveal and place them in the staging area. 
    Also, place the Nazgûl of Dol Guldur face up but out of play, alongside the quest deck. 
    Then, shuffle the encounter deck, and attach 1 encounter to each objective card.
    */
  },
  b: {
    questPoints: 9,
    /*
    When Revealed: Randomly select 1 hero card (among all the heroes controlled by the players) and turn it facedown. 
    The hero is now considered a "prisoner", cannot be used, cannot be damaged, and does not collect resources, 
    until it is "rescued" (as instructed by card effects) later in this quest.

    The players, as a group, cannot play more than 1 ally card each round.

    Players cannot advance to the next stage of this quest unless they have at least 1 objective card.
    */
  },
});
