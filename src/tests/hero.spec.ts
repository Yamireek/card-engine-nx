import {
  Action,
  CardAction,
  CardDefinition,
  State,
  createState,
} from '@card-engine-nx/state';
import { core } from '@card-engine-nx/cards/core';
import {
  CardId,
  GameZoneType,
  PlayerId,
  PlayerZoneType,
  Side,
} from '@card-engine-nx/basic';
import {
  createView,
  executeAction,
  executeCardAction,
} from '@card-engine-nx/engine';

export function nextStep(state: State) {
  const action = state.next.shift();
  if (!action) {
    return;
  } else {
    executeAction(action);
  }
}

export function advanceToChoiceState(
  state: State,
  onError?: (error: string) => void
) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (state.choice) {
      if (state.choice.multi === false && state.choice.options.length === 1) {
        state.next.unshift(state.choice.options[0].action);
        state.choice = undefined;
      } else {
        return state;
      }
    }

    if (state.next.length === 0) {
      return;
    }

    try {
      nextStep(state);
    } catch (error: any) {
      if (onError) {
        onError(error.message);
      } else {
        throw error;
      }
    }
  }
}

export class GameEngine {
  constructor(public state = createState()) {
    advanceToChoiceState(state);
    state.choice = undefined;
    state.next = [];
  }

  do(action: Action) {
    this.state.next.unshift(action);
    advanceToChoiceState(this.state);
  }

  // doAction(title: string) {
  //   const action = this.actions.find((a) => a.description === title);
  //   if (action) {
  //     this.do(action.action);
  //   } else {
  //     throw new Error(
  //       'action not found, choices are: \r\n' +
  //         this.actions.map((o) => o.description).join('\r\n')
  //     );
  //   }
  // }

  // makeChoice(title: string, index: number) {
  //   if (this.state.choice) {
  //     if (this.state.choice.title === title) {
  //       const action = this.state.choice.options[index].action;
  //       this.state.choice = undefined;
  //       this.do(action);
  //     } else {
  //       throw new Error(`Different choice title: ${this.state.choice.title}`);
  //     }
  //   } else {
  //     throw new Error('no choices');
  //   }
  // }

  // chooseOption(title: string) {
  //   if (!this.state.choice) {
  //     throw new Error('no choice');
  //   }

  //   const option = this.state.choice.options.find((o) => o.title === title);

  //   if (option) {
  //     this.state.choice = undefined;
  //     this.do(option.action);
  //   } else {
  //     throw new Error(
  //       'option not found, choices are: \r\n' +
  //         this.state.choice.options.map((o) => o.title).join('\r\n')
  //     );
  //   }
  // }

  private ensurePlayerA() {
    if (!this.state.players.A) {
      this.addPlayer();
    }
  }

  addPlayer() {
    if (!this.state.players.A) {
      addPlayer().execute(this.state);
      return new PlayerProxy(this.state, 'A');
    }

    if (!this.state.players.B) {
      addPlayer().execute(this.state);
      return new PlayerProxy(this.state, 'B');
    }

    throw new Error('cant add new player');
  }

  addHero(hero: CardDefinition): CardProxy {
    this.ensurePlayerA();

    const id = addCard(hero, 'front', {
      type: 'playerArea',
      owner: 'A',
    }).execute(this.state);
    return new CardProxy(this.state, id);
  }

  // addToLibrary(card: CardDefinition): CardProxy {
  //   this.ensurePlayerA();

  //   const id = addCard(this.state, card, 'back', playerZone('A', 'library'));
  //   return new CardProxy(this.state, id);
  // }

  // addToHand(card: CardDefinition, player: PlayerProxy): CardProxy {
  //   const id = addCard(this.state, card, 'back', playerZone(player.id, 'hand'));
  //   return new CardProxy(this.state, id);
  // }

  // get view() {
  //   return toView(this.state);
  // }

  // get actions() {
  //   const view = this.view;
  //   return values(view.cards).flatMap((card) =>
  //     card.actions.flatMap((action) => {
  //       const enabled = evaluateBool(action.enabled, this.state);
  //       if (!enabled) {
  //         return [];
  //       }
  //       return [
  //         {
  //           description: action.description,
  //           action: action.action,
  //         },
  //       ];
  //     })
  //   );
  // }
}

export class CardProxy {
  constructor(private state: State, private id: CardId) {}

  update(cardAction: CardAction) {
    executeCardAction(cardAction, this.state.cards[this.id]);
    advanceToChoiceState(this.state);
  }

  get props() {
    const view = createView(this.state);
    return view.cards[this.id].props;
  }

  get token() {
    return this.state.cards[this.id].token;
  }

  // get responses() {
  //   const view = toView(this.state);
  //   return view.cards[this.id].responses;
  // }
}

export class PlayerProxy {
  constructor(private state: State, public id: PlayerId) {}

  // get hand() {
  //   return this.state.players[this.id]!.zones.hand;
  // }
}

it("Gimli's attack bonus", () => {
  const game = new GameEngine();
  const gimli = game.addHero(core.hero.gimli);
  expect(gimli.props.attack).toEqual(2);
  gimli.update({ dealDamage: 1 });
  expect(gimli.props.attack).toEqual(3);
  gimli.update({ heal: 1 });
  expect(gimli.props.attack).toEqual(2);
});

export function addPlayer() {
  return {
    print: () => 'addPlayer()',
    execute: (state: State) => {
      const playerId = !state.players.A
        ? 'A'
        : !state.players.B
        ? 'B'
        : state.players.C
        ? 'C'
        : 'D';

      state.players[playerId] = {
        id: playerId,
        thread: 0,
        zones: {
          hand: { cards: [], stack: false },
          library: { cards: [], stack: true },
          playerArea: { cards: [], stack: false },
          discardPile: { cards: [], stack: true },
          engaged: { cards: [], stack: false },
        },
        limitUses: { game: {} },
        flags: {},
      };
    },
    result: () => 'full',
  };
}

export type Zone =
  | {
      owner: 'game';
      type: GameZoneType;
    }
  | { owner: PlayerId; type: PlayerZoneType };

export function addCard(definition: CardDefinition, side: Side, zone: Zone) {
  return {
    print: () => 'addCard()',
    execute: (state: State) => {
      const id = state.nextId;
      state.cards[id] = {
        id,
        token: {
          damage: 0,
          progress: 0,
          resources: 0,
        },
        mark: {
          questing: false,
          attacking: false,
          defending: false,
          attacked: false,
        },
        sideUp: side,
        tapped: false,
        definition: definition,
        attachments: [],
        owner: zone.owner,
        controller: zone.owner,
        limitUses: {
          phase: {},
          round: {},
        },
        modifiers: [],
      };
      state.nextId++;

      getZone(zone, state).cards.push(id);
      return id;
    },
    result: () => 'full',
  };
}

export function getZone(zone: Zone, state: State) {
  if (zone.owner === 'game') {
    return state.zones[zone.type];
  } else {
    const player = state.players[zone.owner];
    if (player) {
      return player.zones[zone.type];
    } else {
      throw new Error('Player not found');
    }
  }
}
