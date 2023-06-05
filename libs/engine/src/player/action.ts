import { PlayerState, PlayerAction } from '@card-engine-nx/state';
import { last, shuffle } from 'lodash';
import { calculateExpr } from '../expr';
import { uiEvent } from '../eventFactories';
import { ExecutionContext } from '../action';

export function executePlayerAction(
  action: PlayerAction,
  player: PlayerState,
  ctx: ExecutionContext
) {
  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleLibrary') {
    const zone = player.zones['library'];
    zone.cards = shuffle(zone.cards);
    return;
  }

  if (action === 'commitCharactersToQuest') {
    throw new Error('not implemented');
  }

  if (action === 'engagementCheck') {
    throw new Error('not implemented');
  }

  if (action === 'optionalEngagement') {
    throw new Error('not implemented');
  }

  if (action === 'resolveEnemyAttacks') {
    throw new Error('not implemented');
  }

  if (action === 'resolvePlayerAttacks') {
    throw new Error('not implemented');
  }

  if (action.draw) {
    for (let index = 0; index < action.draw; index++) {
      const top = last(player.zones.library.cards);
      if (top) {
        ctx.state.cards[top].sideUp = 'front';
        player.zones.library.cards.pop();
        player.zones.hand.cards.push(top);
        ctx.events.send(
          uiEvent.card_moved({
            cardId: top,
            source: { type: 'library', owner: player.id },
            destination: { type: 'hand', owner: player.id },
            side: 'front',
          })
        );
      }
    }
    return;
  }

  if (action.incrementThreat) {
    const amount = calculateExpr(action.incrementThreat, ctx);
    player.thread += amount;
    return;
  }

  throw new Error(`unknown player action: ${JSON.stringify(action)}`);
}
