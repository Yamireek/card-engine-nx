import { quest } from '@card-engine-nx/state';

export const outOfTheDungeons = quest({
  sequence: 3,
  name: 'Out of the Dungeons',
  a: {},
  b: {
    questPoints: 7,
    /*
    Forced: At the beginning of each quest phase, each player places the top card of his deck, 
    face down in front of him as if it just engaged him from the staging area. 
    These cards are called "Orc Guard" and act as enemies with: 1 hit point, 1 Attack and 1 Defense

    Players cannot defeat this stage while Nazgûl of Dol Guldur is in play. 
    If this stage is defeated and Nazgûl of Dol Guldur is not in play, the players have won the game.
    */
  },
});
