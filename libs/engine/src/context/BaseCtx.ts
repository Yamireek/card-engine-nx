import {
  intersection,
  isArray,
  last,
  mapValues,
  max,
  reverse,
  sum,
  uniq,
} from "lodash";
import { takeRight } from "lodash/fp";
import { computed, makeObservable, toJS } from "mobx";
import { CardId, Random, Token, keys, values } from "@card-engine-nx/basic";
import {
  Action,
  BoolExpr,
  CardTarget,
  NumberExpr,
  PlayerTarget,
  Scope,
  ScopeAction,
  State,
  StateModifiers,
  ZoneTarget,
  createCardState,
  createPlayerState,
} from "@card-engine-nx/state";
import { UIEvents } from "../events";
import { Logger } from "../logger";
import { gameRound } from "../round";
import { PlayerCtx, ZoneCtx, CardCtx } from "./internal";
import { getCardFromScope, getPlayerFromScope } from "./utils";

export abstract class BaseCtx {
  private readonly _scopes: Scope[] = [];

  constructor(
    public state: State,
    public events: UIEvents,
    public random: Random,
    public logger: Logger,
    private observable = true
  ) {
    makeObservable(this, {
      state: observable,
      cards: computed,
      scopes: computed,
    });
  }

  get cards() {
    return mapValues(
      this.state.cards,
      (card) => new CardCtx(this, card.id, this.observable)
    );
  }

  get players() {
    return mapValues(
      this.state.players,
      (player) => new PlayerCtx(this, player?.id ?? "0", this.observable)
    );
  }

  get scopes(): Scope[] {
    return [...this.state.scopes, ...this._scopes];
  }

  next(...action: Action[]) {
    this.state.next.unshift(...action);
  }

  useScope<T>(scope: Scope, action: () => T) {
    this._scopes.push(scope);
    const result = action();
    this._scopes.pop();
    return result;
  }

  withScope<T>(scopeAction: ScopeAction, action: () => T) {
    const scope: Scope = {};
    this.executeScopeAction(scope, scopeAction);
    return this.useScope(scope, action);
  }

  getCard(target: CardTarget) {
    if (typeof target === "number") {
      return this.cards[target];
    }

    const cards = this.getCards(target);

    if (cards.length === 1) {
      return cards[0];
    }

    throw new Error("multiple or none cards found");
  }

  getCards(target: CardTarget): CardCtx[] {
    if (typeof target === "number") {
      return [this.cards[target]];
    }

    if (isArray(target)) {
      return target.map((id) => this.cards[id]);
    }

    if (target === "each") {
      return values(this.cards);
    }

    if (typeof target !== "string" && target.top) {
      if (typeof target.top !== "string" && "amount" in target.top) {
        const zone = this.getZone(target.top.zone);
        const cards = zone.state.cards.map((id) => this.cards[id]);
        const predicate = target.top.filter;
        const filtered = predicate
          ? cards.filter((c) => c.is(predicate))
          : cards;
        const amount = this.getNumber(target.top.amount);
        return takeRight(amount)(filtered);
      }

      const zone = this.getZone(target.top);
      return this.getCards(last(zone.state.cards) ?? []);
    }

    if (typeof target !== "string" && target.take) {
      const all = this.getCards({ ...target, take: undefined });
      return all.slice(0, target.take);
    }

    if (typeof target !== "string" && target.var) {
      const inScope = getCardFromScope(this.scopes, target.var);
      if (inScope) {
        return this.getCards(inScope);
      }

      return [];
    }

    return values(this.cards).filter((c) => c.is(target));

    throw new Error(`unknown card target: ${JSON.stringify(target)}`);
  }

  getBool(expr: BoolExpr): boolean {
    throw new Error("Method not implemented.");
  }

  getNumber(expr: NumberExpr) {
    if (typeof expr === "number") {
      return expr;
    }

    if (typeof expr === "string") {
      throw new Error("unknown NumberExpr: " + JSON.stringify(expr));
    }

    if ("card" in expr && expr.card) {
      const card = this.getCard(expr.card.target);
      return card.getNumber(expr.card.value);
    }

    throw new Error("unknown NumberExpr: " + JSON.stringify(expr));
  }

  getZone(target: ZoneTarget) {
    if (typeof target === "string") {
      return new ZoneCtx(this, target);
    }

    const player = this.getPlayer(target.player);
    return new ZoneCtx(this, { player: player.id, type: target.type });
  }

  canExecute(action: Action, payment: boolean): boolean {
    if (isArray(action)) {
      return action.every((a) => this.canExecute(a, payment));
    }

    if (typeof action === "string") {
      if (action === "revealEncounterCard") {
        return true;
      }

      if (action === "shuffleEncounterDeck") {
        return true;
      }

      if (action === "endScope") {
        return true;
      }

      throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
    } else {
      if ("player" in action && "action" in action) {
        const players = this.getPlayers(action.player);
        return players.some((player) => player.canExecute(action.action));
      }

      if ("card" in action && "action" in action) {
        const cards = this.getCards(action.card);
        return cards.some((card) => card.canExecute(action.action));
      }

      if ("useScope" in action) {
        const scope: Scope = {};
        this.executeScopeAction(scope, action.useScope);
        return this.useScope(scope, () =>
          this.canExecute(action.action, payment)
        );
      }

      if (action.payment) {
        const payment = this.canExecute(action.payment.cost, true);
        const effect = this.canExecute(action.payment.effect, false);
        return payment && effect;
      }

      if (action.useLimit) {
        const card = action.useLimit.card;
        const existing = this.state.actionLimits.find((u) => u.card === card);
        return !existing || existing.amount < action.useLimit.max;
      }

      if (action.resolveAttack) {
        return true;
      }

      if (action.atEndOfPhase) {
        return true;
      }

      if (action.placeProgress) {
        return true;
      }

      if (action.cancel) {
        return this.state.stack.length > 0;
      }

      if (action.event) {
        return true;
      }

      if (action.repeat) {
        return this.canExecute(action.repeat.action, payment);
      }

      if (action.if) {
        const result = this.getBool(action.if.condition);
        if (result) {
          return (
            action.if.true !== undefined &&
            this.canExecute(action.if.true, payment)
          );
        } else {
          return (
            action.if.false !== undefined &&
            this.canExecute(action.if.false, payment)
          );
        }
      }
    }

    throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
  }

  execute(action: Action) {
    if (isArray(action)) {
      this.next(...action);
      return;
    }

    if (action === "empty") {
      return;
    }

    if (action === "shuffleEncounterDeck") {
      const zone = this.state.zones.encounterDeck;
      zone.cards = this.random.shuffle(zone.cards);
      return;
    }

    if (action === "setup") {
      this.next(
        {
          choice: {
            id: this.state.nextId++,
            title: "Setup",
            type: "show",
            cardId: this.state.zones.questArea.cards[0] ?? 0,
          },
        },
        ...values(this.cards).flatMap((c) =>
          c.rules.setup ? [c.rules.setup] : []
        ),
        {
          card: {
            zone: "questArea",
          },
          action: {
            flip: "back",
          },
        },
        {
          choice: {
            id: this.state.nextId++,
            title: "Setup",
            type: "show",
            cardId: this.state.zones.questArea.cards[0] ?? 0,
          },
        }
      );
      return;
    }

    if (action === "endRound") {
      this.state.actionLimits = this.state.actionLimits.filter(
        (l) => l.type !== "round"
      );

      for (const player of values(this.state.players)) {
        for (const limit of keys(player.limits)) {
          if (player.limits[limit].type === "round") {
            delete player.limits[limit];
          }
        }
      }

      this.state.modifiers = this.state.modifiers.filter(
        (m) => m.until !== "end_of_round"
      );

      this.next({ event: { type: "end_of_round" } }, gameRound());
      this.state.triggers.end_of_round = [];
      this.state.round++;
      return;
    }

    if (action === "endPhase") {
      this.state.actionLimits = this.state.actionLimits.filter(
        (l) => l.type !== "phase"
      );

      for (const player of values(this.state.players)) {
        for (const limit of keys(player.limits)) {
          if (player.limits[limit].type === "phase") {
            delete player.limits[limit];
          }
        }
      }

      this.state.modifiers = this.state.modifiers.filter(
        (m) => m.until !== "end_of_phase"
      );

      this.next(...this.state.triggers.end_of_phase);
      this.state.triggers.end_of_phase = [];
      return;
    }

    if (action === "chooseTravelDestination") {
      const existing = this.getCards({ zoneType: "activeLocation" });
      if (existing.length > 0) {
        return;
      }

      this.next({
        player: "first",
        action: {
          chooseCardActions: {
            title: "Choose location for travel",
            target: {
              zone: "stagingArea",
              type: "location",
            },
            action: "travel",
            optional: true,
          },
        },
      });
      return;
    }

    if (action === "dealShadowCards") {
      this.next({
        card: { type: "enemy", zoneType: "engaged" },
        action: "dealShadowCard",
      });
      return;
    }

    if (action === "passFirstPlayerToken") {
      const next = this.getPlayer("next");
      this.state.firstPlayer = next.id;
      return;
    }

    if (action === "resolveQuesting") {
      const totalWillpower = this.getNumber({
        card: {
          target: { mark: "questing" },
          value: "willpower",
          sum: true,
        },
      });

      const totalThreat = this.getNumber("totalThreat");

      const diff = totalWillpower - totalThreat;
      if (diff > 0) {
        this.next({ placeProgress: diff });
      }
      if (diff < 0) {
        this.next({ player: "each", action: { incrementThreat: -diff } });
      }
      return;
    }

    if (action === "revealEncounterCard") {
      const card = this.getCard({ top: "encounterDeck" });

      if (!card) {
        if (this.state.zones.discardPile.cards.length > 0) {
          this.next(
            {
              card: {
                zone: "discardPile",
              },
              action: {
                move: {
                  to: "encounterDeck",
                  side: "back",
                },
              },
            },
            "shuffleEncounterDeck",
            "revealEncounterCard"
          );
        }

        return;
      }

      this.next({
        card: card.id,
        action: "reveal",
      });

      return;
    }

    if (action === "win") {
      const playerScores = values(this.state.players).map((p) => {
        const threat = p.thread;
        const deadHeroes = this.getCards({
          zone: { player: p.id, type: "discardPile" },
          type: "hero",
        });

        const aliveHeroes = this.getCards({
          zone: { player: p.id, type: "discardPile" },
          type: "hero",
        });

        return (
          threat +
          sum(deadHeroes.map((h) => h.props.threatCost)) +
          sum(aliveHeroes.map((h) => h.token.damage))
        );
      });

      const victoryCards = this.getCards({
        zoneType: "victoryDisplay",
      });

      const score =
        sum(playerScores) -
        sum(victoryCards.map((c) => c.props.victory)) +
        this.state.round * 10;

      this.state.result = {
        win: true,
        score,
      };
      return;
    }

    if (action === "loose") {
      this.state.result = {
        win: false,
        score: 0,
      };
      return;
    }

    if (action === "stackPop") {
      const effect = this.state.stack.pop();
      if (effect) {
        if ("whenRevealed" in effect && !effect.canceled) {
          this.next(effect.whenRevealed);
        }
        if ("shadow" in effect && !effect.canceled) {
          this.next(effect.shadow);
        }
      }
      return;
    }

    if (action === "stateCheck") {
      const destroy = this.getCards("destroyed");
      const explore = this.getCards({ simple: "explored", type: "location" });
      const advance = this.getCards({ simple: "explored", type: "quest" });

      if (destroy.length > 0 || explore.length > 0 || advance.length > 0) {
        this.next("stateCheck");
      }

      if (destroy.length > 0) {
        this.next({
          card: destroy.map((c) => c.id),
          action: "destroy",
        });
      }

      if (explore.length > 0) {
        this.next({
          card: explore.map((c) => c.id),
          action: "explore",
        });
      }

      if (advance.length > 0) {
        this.next({
          card: advance.map((c) => c.id),
          action: "advance",
        });
      }

      for (const player of values(this.state.players)) {
        const heroes = this.getCards({
          simple: "inAPlay",
          type: "hero",
          controller: player.id,
        });
        if (heroes.length === 0) {
          this.next({ player: player.id, action: "eliminate" });
          return;
        }
      }

      return;
    }

    if (action === "sendCommitedEvents") {
      const questers = this.getCards({ mark: "questing" });
      if (questers.length > 0) {
        this.next(
          questers.map((card) => ({
            event: {
              type: "commits",
              card: card.id,
            },
          }))
        );
      }
      return;
    }

    if (action === "endScope") {
      this.state.scopes.pop();
      return;
    }

    if (action === "surge++") {
      this.state.surge++;
      return;
    }

    if (action === "surge--") {
      this.state.surge--;
      return;
    }

    if ("player" in action && "action" in action) {
      const players = this.getPlayers(action.player);
      for (const player of players) {
        if (action.scooped) {
          player.execute(action.action);
        } else {
          this.next({
            useScope: { var: "target", player: player.id },
            action: { player: player.id, action: action.action, scooped: true },
          });
        }
      }
      return;
    }

    if ("card" in action && "action" in action) {
      const cards = this.getCards(action.card);

      if (action.scooped) {
        for (const card of cards) {
          card.execute(action.action);
        }
        return;
      } else {
        for (const card of cards) {
          this.next({
            useScope: { var: "target", card: card.id },
            action: { card: card.id, action: action.action, scooped: true },
          });
        }

        return;
      }
    }

    if ("useScope" in action) {
      const scope: Scope = {};
      this.executeScopeAction(scope, action.useScope);
      this.state.scopes.push(scope);
      this.next(action.action, "endScope");
      return;
    }

    if (action.stackPush) {
      if (action.stackPush.type === "whenRevealed") {
        const hasEffect = this.canExecute(action.stackPush.whenRevealed, false);
        if (!hasEffect) {
          return;
        }
      }

      if (action.stackPush.type === "shadow") {
        const hasEffect = this.canExecute(action.stackPush.shadow, false);
        if (!hasEffect) {
          return;
        }
      }

      this.state.stack.push(action.stackPush);

      // const responses = this.view.responses[action.stackPush.type] ?? [];
      // const reponsesAction: Action =
      //   responses.length > 0
      //     ? [
      //         {
      //           player: 'first',
      //           action: {
      //             chooseActions: {
      //               title: `Choose responses for: ${action.stackPush.description}`,
      //               actions: responses.map((r) => ({
      //                 title: r.description,
      //                 action: {
      //                   useScope: [
      //                     {
      //                       var: 'target',
      //                       card: r.card,
      //                     },
      //                     {
      //                       var: 'self',
      //                       card: r.source,
      //                     },
      //                   ],
      //                   action: r.action,
      //                 },
      //               })),
      //               optional: true,
      //               multi: true,
      //             },
      //           },
      //         },
      //       ]
      //     : [];
      // this.next(reponsesAction);
      return;
    }

    if (action.cancel) {
      const effect = last(this.state.stack);
      if (!effect) {
        throw new Error("no effect to cancel");
      }

      if ("whenRevealed" in effect && action.cancel === "when.revealed") {
        effect.canceled = true;
      }

      if ("shadow" in effect && action.cancel === "shadow") {
        effect.canceled = true;
      }
      return;
    }

    if (action.addPlayer) {
      const playerId = !this.state.players[0]
        ? "0"
        : !this.state.players[1]
        ? "1"
        : this.state.players[2]
        ? "3"
        : "2";

      this.state.players[playerId] = createPlayerState(playerId);

      for (const card of action.addPlayer.library) {
        this.next({
          addCard: {
            definition: card,
            side: "back",
            zone: { player: playerId, type: "library" },
          },
        });
      }

      for (const hero of reverse(action.addPlayer.heroes)) {
        this.next({
          addCard: {
            definition: hero,
            side: "front",
            zone: { player: playerId, type: "playerArea" },
          },
        });
      }

      const player = this.state.players[playerId];

      if (player) {
        player.thread = sum(
          action.addPlayer.heroes.map((h) => h.front.threatCost ?? 0)
        );
      }

      return;
    }

    if (action.setupScenario) {
      for (const questCard of action.setupScenario.scenario.quest) {
        this.next({
          addCard: {
            definition: questCard,
            side: "front",
            zone: "questDeck",
          },
        });
      }

      for (const set of action.setupScenario.scenario.sets) {
        if (action.setupScenario.difficulty === "normal") {
          for (const card of set.normal) {
            this.next({
              addCard: {
                definition: card,
                side: "back",
                zone: "encounterDeck",
              },
            });
          }
        }

        for (const card of set.easy) {
          this.next({
            addCard: {
              definition: card,
              side: "back",
              zone: "encounterDeck",
            },
          });
        }
      }

      return;
    }

    if (action.beginPhase) {
      this.state.phase = action.beginPhase;
      return;
    }

    if (action.choice) {
      this.state.choice = action.choice;
      return;
    }

    if (action.playerActions) {
      this.next("stateCheck", {
        choice: {
          id: this.state.nextId++,
          title: action.playerActions,
          type: "actions",
        },
      });
      return;
    }

    if (action.repeat) {
      const amount = this.getNumber(action.repeat.amount);
      if (amount === 0) {
        return;
      } else {
        this.next(action.repeat.action, {
          repeat: {
            amount: amount - 1,
            action: action.repeat.action,
          },
        });
      }
      return;
    }

    if (action.clearMarks) {
      for (const card of values(this.state.cards)) {
        card.mark[action.clearMarks] = false;
      }
      return;
    }

    if (action.placeProgress !== undefined) {
      if (action.placeProgress === 0) {
        return;
      }

      const activeLocations = this.getCards({ top: "activeLocation" });

      if (activeLocations.length === 0) {
        this.next({
          card: { top: "questArea" },
          action: { placeProgress: action.placeProgress },
        });
        return;
      }

      if (activeLocations.length === 1) {
        const card = activeLocations[0];
        const qp = card.props.questPoints;
        if (qp) {
          const remaining = qp - card.token.progress;
          const progressLocation = Math.min(action.placeProgress, remaining);
          const progressQuest = action.placeProgress - progressLocation;

          this.next(
            {
              card: activeLocations.map((c) => c.id),
              action: { placeProgress: progressLocation },
            },
            {
              card: { top: "questArea" },
              action: { placeProgress: progressQuest },
            }
          );
        }
      } else {
        throw new Error("multiple active locations");
      }
      return;
    }

    if (action.while) {
      const condition = this.getBool(action.while.condition);
      if (condition) {
        this.next(action.while.action, action);
      }
      return;
    }

    if (action.payment) {
      this.next(action.payment.cost, action.payment.effect);
      return;
    }

    if (action.useLimit) {
      const existing = this.state.actionLimits.find(
        (l) => l.card === action.useLimit?.card
      );

      if (!existing) {
        this.state.actionLimits.push({
          card: action.useLimit.card,
          amount: 1,
          type: action.useLimit.type,
        });
      } else {
        existing.amount += 1;
      }
      return;
    }

    if (action.event) {
      if (action.event === "none") {
        this.state.event?.pop();
        return;
      }

      const event = action.event;

      if (!this.state.event) {
        this.state.event = [];
      }

      if (event.type === "revealed") {
        this.state.choice = {
          id: this.state.nextId++,
          title: "Revealed",
          type: "show",
          cardId: event.card,
        };
      }

      this.state.event.push(action.event);

      this.next({ event: "none" });

      // const reponses = this.view.responses[event.type] ?? [];
      // const forced = reponses
      //   .filter((r) => r.forced)
      //   .filter((r) => ('card' in event ? r.card === event.card : true))
      //   .filter(
      //     (r) =>
      //       !r.condition ||
      //       calculateBoolExpr(
      //         r.condition,
      //         updatedScopes(ctx, [
      //           { var: 'target', card: r.card },
      //           { var: 'self', card: r.source },
      //         ])
      //       )
      //   );
      // const optional = reponses
      //   .filter((r) => !r.forced)
      //   .filter((r) => ('card' in event ? r.card === event.card : true))
      //   .filter(
      //     (r) =>
      //       !r.condition ||
      //       calculateBoolExpr(
      //         r.condition,
      //         updatedScopes(ctx, [
      //           { var: 'target', card: r.card },
      //           { var: 'self', card: r.source },
      //         ])
      //       )
      //   );
      // if (optional.length > 0) {
      //   this.next({
      //     player: 'first',
      //     action: {
      //       chooseActions: {
      //         title: 'Choose responses for event ' + event.type,
      //         actions: optional.map((r) => ({
      //           title: r.description,
      //           action: {
      //             useScope: [
      //               {
      //                 var: 'target',
      //                 card: r.card,
      //               },
      //               {
      //                 var: 'self',
      //                 card: r.source,
      //               },
      //             ],
      //             action: r.action,
      //           },
      //         })),
      //         optional: true,
      //         multi: true,
      //       },
      //     },
      //   });
      // }
      // if (forced.length > 0) {
      //   this.next(
      //     ...forced.map((r) => ({
      //       useScope: [
      //         {
      //           var: 'target',
      //           card: r.card,
      //         },
      //         {
      //           var: 'self',
      //           card: r.source,
      //         },
      //       ],
      //       action: r.action,
      //     }))
      //   );
      // }
      // if (action.event.type === 'revealed') {
      //   if (this.view.cards[action.event.card].props.keywords?.surge) {
      //     this.next('surge++');
      //   }
      //   const whenRevealed =
      //     this.view.cards[action.event.card].rules.whenRevealed ?? [];
      //   if (whenRevealed.length > 0) {
      //     const target = action.event.card;
      //     this.next(
      //       whenRevealed.map((effect) => ({
      //         card: target,
      //         action: {
      //           whenRevealed: effect,
      //         },
      //       }))
      //     );
      //   }
      // }
      return;
    }

    if (action.resolveAttack) {
      const attacking = this.getCards(action.resolveAttack.attackers);
      const defender = this.getCards(action.resolveAttack.defender);

      const attack = sum(attacking.map((a) => a.props.attack || 0));
      const defense = sum(defender.map((d) => d.props.defense || 0));

      const damage = attack - defense;
      if (damage > 0) {
        if (defender.length === 1) {
          this.next({
            card: defender.map((c) => c.id),
            action: {
              dealDamage: {
                amount: damage,
                attackers: attacking.map((a) => a.id),
              },
            },
          });
        } else {
          throw new Error("unexpected defender count");
        }
      }
      return;
    }

    if (action.atEndOfPhase) {
      this.state.triggers.end_of_phase.push(action.atEndOfPhase);
      return;
    }

    if (action.if) {
      const result = this.getBool(action.if.condition);
      if (result && action.if.true) {
        this.next(action.if.true);
      }

      if (!result && action.if.false) {
        this.next(action.if.false);
      }
      return;
    }

    if (action.addCard) {
      const zone = this.getZone(action.addCard.zone);
      const owner =
        typeof action.addCard.zone !== "string"
          ? action.addCard.zone.player
          : undefined;
      const cardId = this.state.nextId++;
      zone.state.cards.push(cardId);
      const cardState = createCardState(
        cardId,
        action.addCard.side,
        action.addCard.definition,
        typeof action.addCard.zone !== "string" &&
          action.addCard.zone.type !== "engaged"
          ? owner
          : undefined,
        action.addCard.zone
      );

      const tokens: Token[] = ["damage", "progress", "resources"];

      for (const token of tokens) {
        if (action.addCard[token]) {
          const amount = action.addCard[token];
          if (amount) {
            cardState.token[token] = amount;
          }
        }
      }

      if (action.addCard.exhausted) {
        cardState.tapped = true;
      }

      if (action.addCard.attachments) {
        const ids: CardId[] = [];
        for (const atachDef of action.addCard.attachments) {
          const attachmenId = this.state.nextId++;
          ids.push(attachmenId);
          const attachmentState = createCardState(
            attachmenId,
            "front",
            atachDef,
            owner,
            action.addCard.zone
          );

          zone.state.cards.push(attachmenId);
          this.state.cards[attachmenId] = attachmentState;
          attachmentState.attachedTo = attachmenId;
        }

        cardState.attachments = ids;
      }

      this.state.cards[cardId] = cardState;

      return;
    }

    throw new Error(`unknown action: ${JSON.stringify(action)}`);
  }

  executeScopeAction(scope: Scope, action: ScopeAction) {
    if (isArray(action)) {
      for (const item of action) {
        this.executeScopeAction(scope, item);
      }
      return;
    }

    if ("var" in action && "card" in action) {
      const target = this.getCards(action.card);

      if (!scope.card) {
        scope.card = {};
      }
      scope.card[action.var] = target.map((c) => c.id);
      return;
    }

    if ("var" in action && "player" in action) {
      const target = this.getPlayers(action.player);

      if (!scope.player) {
        scope.player = {};
      }
      scope.player[action.var] = target.map((t) => t.id);
      return;
    }

    if ("x" in action) {
      scope.x = action.x;
      return;
    }

    throw new Error(`unknown scope action: ${JSON.stringify(action, null, 1)}`);
  }

  getPlayer(target: PlayerTarget): PlayerCtx {
    const players = this.getPlayers(target);
    if (players.length === 1) {
      return players[0];
    }

    throw new Error("multiple or none players found");
  }

  getPlayers(target: PlayerTarget): PlayerCtx[] {
    if (isArray(target)) {
      return target.flatMap((id) => this.players[id] ?? []);
    }

    if (target === "each") {
      return values(this.players).filter((p) => !p.state.eliminated);
    }

    if (
      target === "owner" ||
      target === "controller" ||
      target === "target" ||
      target === "defending"
    ) {
      const player = getPlayerFromScope(this.scopes, target);
      if (player) {
        return this.getPlayers(player);
      }

      throw new Error(`no ${target} player in scope`);
    }

    if (target === "first") {
      return values(this.players).filter(
        (p) => p.id === this.state.firstPlayer
      );
    }

    if (typeof target === "object") {
      if (target.and) {
        const lists = target.and.map((t) =>
          this.getPlayers(t).map((p) => p.id)
        );
        return this.getPlayers(uniq(intersection(...lists)));
      }

      if (target.not) {
        const not = this.getPlayers(target.not);
        return values(this.players).filter((key) => !not.includes(key));
      }

      if (target.controllerOf) {
        const card = this.getCard(target.controllerOf);
        if (card.state.controller) {
          return this.getPlayers(card.state.controller);
        } else {
          return [];
        }
      }

      throw new Error(`unknown player target: ${JSON.stringify(target)}`);
    }

    if (target === "next") {
      const players = values(this.players).filter((p) => !p.state.eliminated);

      if (players.length === 1) {
        return players;
      }

      const index = players.findIndex((p) => p.id === this.state.firstPlayer);
      if (index === players.length - 1) {
        return [players[0]];
      } else {
        return [players[index + 1]];
      }
    }

    if (target === "event") {
      const event = last(this.state.event);
      if (event && "player" in event) {
        return this.getPlayers(event.player);
      } else {
        throw new Error("no player in event");
      }
    }

    if (target === "highestThreat") {
      const players = values(this.players);
      const value = max(players.map((p) => p.state.thread));
      if (value !== undefined) {
        return players.filter((p) => value === p.state.thread);
      } else {
        return [];
      }
    }

    if (["0", "1", "2", "3"].includes(target)) {
      return values(this.players).filter((p) => p.id === target);
    }

    throw new Error(`unknown player target: ${JSON.stringify(target)}`);
  }

  abstract get modifiers(): StateModifiers;
}
