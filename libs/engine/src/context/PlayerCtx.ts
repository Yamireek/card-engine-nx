import { isArray, max, sum, sumBy } from 'lodash';
import { action, computed, makeObservable } from 'mobx';
import { PlayerId, values } from '@card-engine-nx/basic';
import {
  Action,
  CardAction,
  CardTarget,
  Event,
  PlayerAction,
  PlayerNumberExpr,
  PlayerRules,
} from '@card-engine-nx/state';
import {
  ExeCtx,
  canCharacterAttack,
  canCharacterDefend,
  canEnemyAttack,
} from './internal';

export class PlayerCtx {
  constructor(
    public game: ExeCtx,
    public readonly id: PlayerId,
    observable: boolean
  ) {
    if (observable) {
      makeObservable(this, {
        state: computed({ keepAlive: true }),
        execute: action,
      });
    }
  }

  get state() {
    const state = this.game.state.players[this.id];
    if (!state) {
      throw new Error('not found');
    }
    return state;
  }

  get rules(): PlayerRules {
    return this.game.modifiers.players[this.id] ?? {};
  }

  canExecute(action: PlayerAction): boolean {
    if (isArray(action)) {
      return action.every((a) => this.canExecute(a));
    }

    if (this.state.eliminated) {
      return false;
    }

    if (typeof action === 'string') {
      if (action === 'resolvePlayerAttacks') {
        return true;
      }

      if (action === 'shuffleLibrary') {
        return true;
      }

      throw new Error(
        `not implemented: canPlayerExecute ${JSON.stringify(action)}`
      );
    } else {
      if (action.chooseCardActions) {
        const targets = this.game.getCards(action.chooseCardActions.target);
        const cardAction = action.chooseCardActions.action;
        return targets.some((target) => {
          return target.game.useScope({ card: { target: [target.id] } }, () => {
            return target.canExecute(cardAction);
          });
        });
      }

      if (action.choosePlayerActions) {
        const targets = this.game.getPlayers(action.choosePlayerActions.target);
        const playerAction = action.choosePlayerActions.action;
        return targets.some((target) => {
          return target.game.useScope(
            { player: { target: [target.id] } },
            () => {
              return target.canExecute(playerAction);
            }
          );
        });
      }

      if (action.payResources) {
        const sphere = action.payResources.sphere;
        const cost = this.game.getNumber(action.payResources.amount);
        const heroes = this.state.zones.playerArea.cards
          .map((id) => this.game.cards[id])
          .filter((card) => card.props.type === 'hero')
          .filter(
            (c) =>
              sphere.includes('neutral') ||
              c.props.sphere?.some((s) => sphere.includes(s))
          )
          .filter((card) => card.token.resources > 0);

        if (
          action.payResources.needHeroes &&
          heroes.length < action.payResources.needHeroes
        ) {
          return false;
        }

        const available = sumBy(heroes, (hero) => hero.token.resources);

        return available >= cost;
      }

      if (action.draw) {
        return (
          this.state.zones.library.cards.length > 0 && !this.rules.disableDraw
        );
      }

      if (action.discard) {
        return this.state.zones.hand.cards.length >= action.discard.amount;
      }

      if (action.useLimit) {
        const existing = this.state.limits[action.useLimit.key];
        return !existing || existing.uses < action.useLimit.limit.max;
      }

      if (action.engaged) {
        const cardAction = action.engaged;
        return this.state.zones.engaged.cards.some((id) =>
          this.game.cards[id].canExecute(cardAction)
        );
      }

      if (action.controlled) {
        const cardAction = action.controlled;
        const cards = this.game.getCards({ controller: this.id });
        return cards.some((card) => card.canExecute(cardAction));
      }

      if (action.modify) {
        if (action.modify.multipleDefenders) {
          return this.state.zones.engaged.cards.length > 0;
        }

        return true;
      }

      if (action.chooseActions) {
        const actions = action.chooseActions.actions.filter((a) =>
          this.game.canExecute(a.action, false)
        );

        return actions.length > 0;
      }

      if (action.incrementThreat) {
        return true;
      }

      if (action.deck) {
        return this.state.zones.library.cards.length > 0;
      }

      if (action.card) {
        return this.game.canExecute(
          {
            card: action.card.target,
            action: action.card.action,
          },
          false
        );
      }

      if (action.player) {
        return this.game.canExecute(
          {
            player: action.player.target,
            action: action.player.action,
          },
          false
        );
      }

      if (action.chooseX) {
        const min = this.game.getNumber(action.chooseX.min);
        const max = this.game.getNumber(action.chooseX.max);
        return max >= min;
      }

      throw new Error(`not implemented: canExecute ${JSON.stringify(action)}`);
    }
  }

  execute(action: PlayerAction) {
    if (isArray(action)) {
      const actions: Action[] = action.map((a) => ({
        player: this.id,
        action: a,
      }));

      this.game.next(...actions);
      return;
    }

    if (action === 'empty') {
      return;
    }

    if (action === 'shuffleLibrary') {
      const zone = this.state.zones['library'];
      zone.cards = this.game.random.shuffle(zone.cards);
      return;
    }

    if (action === 'commitCharactersToQuest') {
      this.game.next({
        player: this.id,
        action: {
          chooseCardActions: {
            title: 'Choose characters commiting to quest',
            multi: true,
            optional: true,
            target: { simple: 'character', controller: this.id },
            action: 'commitToQuest',
          },
        },
      });
      return;
    }

    if (action === 'engagementCheck') {
      const threat = this.state.thread;
      const enemies = this.game.getCards({
        zone: 'stagingArea',
        type: 'enemy',
      });

      const maxEngagement = max(
        enemies
          .filter((e) => e.props.engagement && e.props.engagement <= threat)
          .map((e) => e.props.engagement)
      );

      if (maxEngagement === undefined) {
        return;
      }

      const enemyChoices = enemies.filter(
        (e) => e.props.engagement === maxEngagement
      );

      this.game.next({
        player: this.id,
        action: {
          chooseCardActions: {
            title: 'Choose enemy to engage',
            target: enemyChoices.map((e) => e.id),
            action: {
              engagePlayer: this.id,
            },
          },
        },
      });
      return;
    }

    if (action === 'optionalEngagement') {
      this.game.next({
        player: this.id,
        action: {
          chooseCardActions: {
            title: 'Choose enemy to optionally engage',
            optional: true,
            target: { zone: 'stagingArea', type: 'enemy' },
            action: {
              engagePlayer: this.id,
            },
          },
        },
      });
      return;
    }

    if (action === 'resolveEnemyAttacks') {
      const enemies = this.game
        .getCards({ type: 'enemy', simple: 'inAPlay' })
        .filter((enemy) => canEnemyAttack(enemy, this));

      if (enemies.length > 0) {
        this.game.next(
          {
            useScope: {
              var: 'defending',
              player: this.id,
            },
            action: {
              player: this.id,
              action: {
                chooseCardActions: {
                  title: 'Choose enemy attacker',
                  target: enemies.map((e) => e.id),
                  action: {
                    resolveEnemyAttacking: this.id,
                  },
                },
              },
            },
          },
          {
            player: this.id,
            action: 'resolveEnemyAttacks',
          }
        );
      }
      return;
    }

    if (action === 'resolvePlayerAttacks') {
      const enemies = this.game.getCards({ type: 'enemy', simple: 'inAPlay' });
      const characters = this.game.getCards({
        simple: ['character', 'ready', 'inAPlay'],
      });
      const attackable = enemies.filter((enemy) =>
        characters.some((character) => canCharacterAttack(character, enemy))
      );
      if (attackable.length > 0) {
        this.game.next({
          player: this.id,
          action: {
            chooseActions: {
              title: 'Choose enemy to attack',
              actions: attackable.map((e) => ({
                title: e.id.toString(),
                cardId: e.id,
                action: [
                  {
                    card: e.id,
                    action: { resolvePlayerAttacking: this.id },
                  },
                  {
                    player: this.id,
                    action: 'resolvePlayerAttacks',
                  },
                ],
                optional: true,
              })),
            },
          },
        });
      }
      return;
    }

    if (action === 'declareDefender') {
      const multiple = !!this.game.players[this.id]?.rules.multipleDefenders;
      const attacker = this.game.getCard({ mark: 'attacking' });
      if (attacker) {
        const defenders = this.game
          .getCards({ simple: ['character', 'inAPlay'] })
          .filter((defender) => canCharacterDefend(defender, attacker));
        if (defenders.length > 0) {
          this.game.next({
            player: this.id,
            action: {
              chooseCardActions: {
                title: !multiple ? 'Declare defender' : 'Declare defenders',
                target: defenders.map((d) => d.id),
                multi: multiple,
                optional: true,
                action: {
                  declareAsDefender: {
                    attacker: attacker.id,
                  },
                },
              },
            },
          });
        }
      }
      return;
    }

    if (action === 'determineCombatDamage') {
      const attacking = this.game.getCards({ mark: 'attacking' });
      const defending = this.game.getCards({ mark: 'defending' });

      const attack = sum(attacking.map((a) => a.props.attack || 0));
      const defense = sum(defending.map((d) => d.props.defense || 0));

      this.game.next({
        card: {
          shadows: attacking.map((c) => c.id),
        },
        action: 'discard',
      });

      this.game.next(
        attacking.map((a) => {
          const event: Event = { type: 'attacked', card: a.id };
          return { event };
        })
      );

      if (
        defending.length === 0 &&
        attacking.some((a) => a.props.type === 'enemy')
      ) {
        this.game.next({
          player: this.id,
          action: {
            chooseCardActions: {
              title: 'Choose hero for undefended attack',
              target: {
                type: 'hero',
                zone: { player: this.id, type: 'playerArea' },
              },
              action: {
                dealDamage: attack,
              },
            },
          },
        });
      } else {
        const damage = attack - defense;
        if (damage > 0) {
          if (defending.length === 1) {
            this.game.next({
              card: defending.map((c) => c.id),
              action: { dealDamage: damage },
            });
          }

          if (defending.length > 1) {
            this.game.next({
              player: this.id,
              action: {
                chooseCardActions: {
                  title: 'Choose character for damage',
                  target: defending.map((c) => c.id),
                  action: {
                    dealDamage: damage,
                  },
                },
              },
            });
          }
        }
      }
      return;
    }

    if (action === 'eliminate') {
      this.state.eliminated = true;

      if (values(this.game.players).every((p) => p.state.eliminated)) {
        this.game.next('loose');
        return;
      }

      this.game.next(
        {
          card: { zone: { player: this.id, type: 'engaged' } },
          action: {
            move: {
              to: 'stagingArea',
            },
          },
        },
        {
          card: { owner: this.id },
          action: 'destroy',
        }
      );

      return;
    }

    if (action.draw) {
      if (this.rules.disableDraw) {
        return;
      }

      this.game.next({
        repeat: {
          amount: action.draw,
          action: {
            card: {
              top: { player: this.id, type: 'library' },
            },
            action: {
              move: {
                from: { player: this.id, type: 'library' },
                to: { player: this.id, type: 'hand' },
                side: 'front',
              },
            },
          },
        },
      });

      this.game.logger.log(`Player ${this.id} draws ${action.draw} cards`);

      return;
    }

    if (action.deck) {
      this.game.next({
        card: this.state.zones.library.cards,
        action: action.deck,
      });
      return;
    }

    if (action.incrementThreat) {
      const amount = this.game.getNumber(action.incrementThreat);
      this.state.thread += amount;
      this.game.logger.warning(
        `Player ${this.id} increments thread by ${amount}`
      );
      return;
    }

    if (action.payResources) {
      const sphere = action.payResources.sphere.includes('neutral')
        ? 'any'
        : action.payResources.sphere;

      const target: CardTarget = { type: 'hero', owner: this.id, sphere };

      const targets = this.game.getCards(target);

      const options = targets.flatMap((card) => {
        if (card.token.resources === 0) {
          return [];
        }
        return {
          title: card.toString(),
          cardId: card.id,
          min: 0,
          max: card.token.resources,
          action: {
            card: card.id,
            action: { payResources: 1 },
          },
        };
      });

      if (options.length === 1) {
        this.game.next({
          card: options[0].cardId,
          action: { payResources: action.payResources.amount },
        });
        return;
      }

      if (
        options.length === action.payResources.needHeroes &&
        options.length === action.payResources.amount
      ) {
        this.game.next({
          card: options.map((o) => o.cardId),
          action: { payResources: 1 },
        });
        return;
      }

      const amount = this.game.getNumber(action.payResources.amount);

      if (amount > 0) {
        this.game.next('stateCheck', {
          choice: {
            id: this.game.state.nextId++,
            player: this.id,
            type: 'split',
            min: amount,
            max: amount,
            title: `Choose how pay ${action.payResources.amount} ${action.payResources.sphere} resources`,
            options,
            count: {
              min: action.payResources.needHeroes ?? 0,
            },
          },
        });
      }

      return;
    }

    if (action.chooseCardActions) {
      const cards = this.game.getCards(action.chooseCardActions.target);
      const cardAction = action.chooseCardActions.action;
      if (cards.length === 0) {
        return;
      }

      this.game.next('stateCheck', {
        choice: {
          id: this.game.state.nextId++,
          player: this.id,
          title: action.chooseCardActions.title,
          type: action.chooseCardActions.multi ? 'multi' : 'single',
          optional: action.chooseCardActions.optional ?? false,
          options: cards.flatMap((card) => {
            const action: Action = {
              useScope: {
                var: 'target',
                card: card.id,
              },
              action: {
                card: card.id,
                action: cardAction,
              },
            };

            const result = this.game.canExecute(action, false);
            if (result) {
              return {
                title: card.id.toString(),
                cardId: card.id,
                action,
              };
            } else {
              return [];
            }
          }),
        },
      });

      return;
    }

    if (action.choosePlayerActions) {
      const players = this.game.getPlayers(action.choosePlayerActions.target);
      const playerAction = action.choosePlayerActions.action;
      if (players.length == 0) {
        return;
      }
      this.game.next('stateCheck', {
        choice: {
          id: this.game.state.nextId++,
          player: this.id,
          title: action.choosePlayerActions.title,
          type: action.choosePlayerActions.multi ? 'multi' : 'single',
          optional: action.choosePlayerActions.optional ?? false,
          options: players
            .filter((p) =>
              p.game.withScope({ var: 'target', player: p.id }, () =>
                p.canExecute(playerAction)
              )
            )
            .map((player) => ({
              title: player.id,
              action: {
                useScope: {
                  var: 'target',
                  player: player.id,
                },
                action: {
                  player: player.id,
                  action: playerAction,
                },
              },
            })),
        },
      });
      return;
    }

    if (action.chooseActions) {
      const options = action.chooseActions.actions.filter((a) =>
        this.game.canExecute(a.action, false)
      );

      this.game.next('stateCheck', {
        choice: {
          id: this.game.state.nextId++,
          player: this.id,
          title: action.chooseActions.title,
          type: action.chooseActions.multi ? 'multi' : 'single',
          optional: action.chooseActions.optional ?? false,
          options,
        },
      });

      return;
    }

    if (action.chooseX) {
      const min = this.game.getNumber(action.chooseX.min);
      const max = this.game.getNumber(action.chooseX.max);
      this.game.next('stateCheck', {
        choice: {
          id: this.game.state.nextId++,
          player: this.id,
          type: 'X',
          min,
          max,
          action: action.chooseX.action,
        },
      });
      return;
    }

    if (action.discard) {
      const target: CardTarget = { zone: { player: this.id, type: 'hand' } };
      const discard: CardAction = {
        move: {
          from: { player: this.id, type: 'hand' },
          to: { player: this.id, type: 'discardPile' },
        },
      };

      if (action.discard.target === 'choice') {
        this.game.next({
          repeat: {
            amount: action.discard.amount,
            action: {
              player: this.id,
              action: {
                chooseCardActions: {
                  title: 'Choose card to discard',
                  target,
                  action: discard,
                },
              },
            },
          },
        });
        return;
      }

      if (action.discard.target === 'random') {
        const cards = this.game.getCards(target);
        const choosen = this.game.random
          .shuffle(cards)
          .slice(0, action.discard.amount)
          .map((c) => c.id);
        this.game.next({
          card: choosen,
          action: discard,
        });

        return;
      }
    }

    if (action.declareAttackers) {
      const enemy = this.game.getCard(action.declareAttackers);
      const characters = this.game
        .getCards({ simple: ['character', 'inAPlay'] })
        .filter((character) => canCharacterAttack(character, enemy));
      if (characters.length > 0) {
        this.game.next({
          player: this.id,
          action: {
            chooseCardActions: {
              title: 'Declare attackers',
              target: characters.map((c) => c.id),
              action: [{ mark: 'attacking' }, 'exhaust'],
              multi: true,
              optional: true,
            },
          },
        });
      }
      return;
    }

    if (action.useLimit) {
      const existing = this.state.limits[action.useLimit.key];
      if (existing) {
        existing.uses += 1;
      } else {
        this.state.limits[action.useLimit.key] = {
          type: action.useLimit.limit.type,
          uses: 1,
        };
      }
      return;
    }

    if (action.engaged) {
      this.game.next({
        card: {
          zone: {
            player: this.id,
            type: 'engaged',
          },
        },
        action: action.engaged,
      });
      return;
    }

    if (action.controlled) {
      this.game.next({
        card: {
          controller: this.id,
        },
        action: action.controlled,
      });
      return;
    }

    if (action.modify) {
      this.game.state.modifiers.push({
        source: 0, // TODO fix
        player: this.id,
        modifier: action.modify,
        until: action.until,
      });
      return;
    }

    if (action.card) {
      this.game.next({
        card: action.card.target,
        action: action.card.action,
      });
      return;
    }

    if (action.player) {
      this.game.next({
        player: action.player.target,
        action: action.player.action,
      });
      return;
    }

    throw new Error(`unknown PlayerAaction: ${JSON.stringify(action)}`);
  }

  getNumber(expr: PlayerNumberExpr): number {
    if ('resources' in expr) {
      const sphere = expr.resources;
      const heroes = this.game.getCards({ sphere, controller: this.id });
      return sum(heroes.map((hero) => hero.token.resources));
    }

    throw new Error('unknown PlayerNumberExpr');
  }
}
