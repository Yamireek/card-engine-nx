import { makeAutoObservable } from 'mobx';
import { ZoneId } from '@card-engine-nx/basic';
import { isInPlay } from '@card-engine-nx/state';
import { ExeCtx } from './internal';

export class ZoneCtx {
  constructor(public game: ExeCtx, public id: ZoneId, observable: boolean) {
    if (observable) {
      makeAutoObservable(this);
    }
  }

  get state() {
    if (typeof this.id === 'string') {
      return this.game.state.zones[this.id];
    }

    const player = this.game.state.players[this.id.player];
    if (!player) {
      throw new Error('player not found');
    }

    return player.zones[this.id.type];
  }

  get type() {
    if (typeof this.id === 'string') {
      return this.id;
    } else {
      return this.id.type;
    }
  }

  get inPlay() {
    return isInPlay(this.type);
  }
}
