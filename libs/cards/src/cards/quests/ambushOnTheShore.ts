import { quest } from '@card-engine-nx/state';

export const ambushOnTheShore = quest({
  sequence: 3,
  name: 'Ambush on the Shore',
  a: {},
  b: {
    questPoints: 0,
    /*
    When Revealed: Reveal 2 encounter cards per player, and add them to the staging area.

    Skip the staging step of the quest phase for the remainder of the game.

    Once there are no enemies in play, the players have won the game.
    */
  },
});
