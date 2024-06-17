import { quest } from '@card-engine-nx/state';

export const throughTheCaverns = quest({
  sequence: 2,
  name: 'Through the Caverns',
  a: {},
  b: {
    questPoints: 15,
    /*
    Response: After placing any number of progress tokens on this card, flip the "prisoner" hero card face-up, 
    and place 1 damage toke on it. The hero has been "rescued" and may now be used by its controller.

    The players, as a group, cannot play more than 1 ally card each round.

    Players cannot advance to the next stage of the quest unless they have rescued the prisoner 
    and have all 3 "Escape from Dol Guldur" objective cards.
    */
  },
});
