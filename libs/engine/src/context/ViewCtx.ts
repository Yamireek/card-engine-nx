import {
  CardId,
  PlayerId,
  asArray,
  keys,
  noRandom,
  values,
} from '@card-engine-nx/basic';
import {
  Ability,
  CardModifier,
  CardRules,
  PlayerRules,
  PropertyModifier,
  State,
  View,
} from '@card-engine-nx/state';
import { emptyEvents } from '../events';
import { nullLogger } from '../logger';
import { createPlayAllyAction } from '../utils';
import { ExeCtx, CardCtx } from './internal';
import { IViewCtx } from './types';

export class ViewCtx extends ExeCtx implements IViewCtx {
  private readonly _modifiers: View;

  constructor(state: State) {
    super(state, emptyEvents, noRandom(), nullLogger, false);
    this._modifiers = {
      cards: {},
      players: {},
      actions: [],
      responses: {},
    };
  }

  get modifiers(): View {
    return this._modifiers;
  }

  addCardModifier(id: CardId, modifier: PropertyModifier) {
    if (!this._modifiers.cards[id]) {
      this._modifiers.cards[id] = {
        modifiers: [],
        rules: [],
      };
    }

    this._modifiers.cards[id].modifiers.push(modifier);
  }

  addCardRule(id: CardId, rule: CardRules) {
    if (!this._modifiers.cards[id]) {
      this._modifiers.cards[id] = {
        modifiers: [],
        rules: [],
      };
    }

    this._modifiers.cards[id].rules.push(rule);
  }

  addPlayerRule(id: PlayerId, rule: PlayerRules) {
    if (!this._modifiers.players[id]) {
      this._modifiers.players[id] = [];
    }

    const list = this._modifiers.players[id];
    if (list) {
      list.push(rule);
    }
  }

  evalModifier(self: CardCtx, modifiers: CardModifier | CardModifier[]) {
    for (const modifier of asArray(modifiers)) {
      if ('increment' in modifier) {
        this.evalAbility(self, {
          description: 'todo',
          increment: modifier.increment,
        });
        continue;
      }

      if ('rules' in modifier) {
        this.addCardRule(self.id, modifier.rules);
        continue;
      }

      if ('if' in modifier) {
        const result = self.getBool(modifier.if.condition);
        if (result && modifier.if.true) {
          this.evalModifier(self, modifier.if.true);
        }
        if (!result && modifier.if.false) {
          this.evalModifier(self, modifier.if.false);
        }
        continue;
      }

      if ('replaceType' in modifier) {
        this.addCardModifier(self.id, {
          prop: 'type',
          op: 'set',
          value: modifier.replaceType,
        });
        continue;
      }

      if ('add' in modifier) {
        if (modifier.add.keyword) {
          this.addCardModifier(self.id, {
            prop: 'keywords',
            op: 'add',
            value: modifier.add.keyword,
          });
        }

        if (modifier.add.sphere) {
          this.addCardModifier(self.id, {
            prop: 'sphere',
            op: 'add',
            value: asArray(modifier.add.sphere),
          });
        }

        if (modifier.add.trait) {
          this.addCardModifier(self.id, {
            prop: 'traits',
            op: 'add',
            value: asArray(modifier.add.trait),
          });
        }

        continue;
      }

      throw new Error('unknown modifier ' + JSON.stringify(modifier));
    }
  }

  evalAbility(self: CardCtx, ability: Ability) {
    const controller = self.state.controller;
    const zone = self.zone.type;

    if ('increment' in ability) {
      if (self.zone.inPlay) {
        const targets = ability.target ? this.getCards(ability.target) : [self];
        for (const property of keys(ability.increment)) {
          const expr = ability.increment[property];
          if (expr) {
            for (const target of targets) {
              const amount = this.withScope(
                { card: target.id, var: 'target' },
                () => this.getNumber(expr)
              );
              this.addCardModifier(target.id, {
                prop: property,
                op: 'inc',
                value: amount,
              });
            }
          }
        }
      }
      return;
    }

    if ('action' in ability) {
      if (ability.phase && ability.phase !== this.state.phase) {
        return;
      }

      if (zone === 'hand' && self.props.type === 'event' && controller) {
        this._modifiers.actions.push({
          source: self.id,
          description: ability.description,
          action: {
            useScope: [
              {
                var: 'self',
                card: self.id,
              },
              {
                var: 'controller',
                player: controller,
              },
            ],
            action: [
              {
                payment: {
                  cost: {
                    card: self.id,
                    action: {
                      payCost: ability.payment ?? {},
                    },
                  },
                  effect: ability.action,
                },
              },
              {
                card: self.id,
                action: {
                  move: {
                    from: {
                      player: 'controller',
                      type: 'hand',
                    },
                    to: {
                      player: 'controller',
                      type: 'discardPile',
                    },
                  },
                },
              },
            ],
          },
        });
      }

      if (zone === 'playerArea' && controller) {
        this._modifiers.actions.push({
          source: self.id,
          description: ability.description,
          action: {
            useScope: {
              var: 'controller',
              player: controller,
            },
            action: {
              useScope: {
                var: 'self',
                card: self.id,
              },
              action: ability.limit
                ? [
                    {
                      useLimit: {
                        card: self.id,
                        type: ability.limit.type,
                        max: ability.limit.max,
                      },
                    },
                    ability.action,
                  ]
                : ability.action,
            },
          },
        });

        return;
      }

      if (zone === 'activeLocation' || zone === 'questArea') {
        this._modifiers.actions.push({
          source: self.id,
          description: ability.description,
          action: {
            useScope: {
              var: 'self',
              card: self.id,
            },
            action: ability.limit
              ? [
                  {
                    useLimit: {
                      card: self.id,
                      type: ability.limit.type,
                      max: ability.limit.max,
                    },
                  },
                  ability.action,
                ]
              : ability.action,
          },
        });
      }

      return;
    }

    if ('response' in ability) {
      if (zone === 'hand' && self.props.type === 'event' && controller) {
        const responses =
          this._modifiers.responses[ability.response.event] ??
          (this._modifiers.responses[ability.response.event] = []);

        responses.push({
          description: ability.description,
          source: self.id,
          cards: asArray(
            ability.target
              ? this.getCards(ability.target).map((c) => c.id)
              : self.id
          ),
          forced: false,
          condition: ability.response.condition,
          action: {
            useScope: {
              var: 'self',
              card: self.id,
            },
            action: {
              useScope: { var: 'controller', player: controller },
              action: [
                {
                  payment: {
                    cost: {
                      card: self.id,
                      action: {
                        payCost: ability.payment ?? {},
                      },
                    },
                    effect: ability.response.action,
                  },
                },
                {
                  card: self.id,
                  action: {
                    move: {
                      from: {
                        player: 'controller',
                        type: 'hand',
                      },
                      to: {
                        player: 'controller',
                        type: 'discardPile',
                      },
                    },
                  },
                },
              ],
            },
          },
        });
      }

      if (self.zone.inPlay || zone === ability.zone) {
        const responses =
          this._modifiers.responses[ability.response.event] ??
          (this._modifiers.responses[ability.response.event] = []);

        responses.push({
          description: ability.description,
          source: self.id,
          cards: asArray(
            ability.target
              ? this.getCards(ability.target).map((c) => c.id)
              : self.id
          ),
          forced: false,
          condition: ability.response.condition,
          action: controller
            ? {
                useScope: {
                  var: 'controller',
                  player: controller,
                },
                action: ability.response.action,
              }
            : ability.response.action,
        });
      }

      return;
    }

    if ('forced' in ability) {
      const responses =
        this._modifiers.responses[ability.forced.event] ??
        (this._modifiers.responses[ability.forced.event] = []);

      if (self.zone.inPlay) {
        responses.push({
          description: ability.description,
          source: self.id,
          cards: asArray(
            ability.target
              ? this.getCards(ability.target).map((c) => c.id)
              : self.id
          ),
          forced: true,
          action: ability.forced.action,
        });
      }

      return;
    }

    if ('whenRevealed' in ability) {
      this.addCardRule(self.id, {
        whenRevealed: [
          {
            description: ability.description,
            action: ability.whenRevealed,
          },
        ],
      });

      return;
    }

    if ('rule' in ability) {
      this.addCardRule(self.id, ability.rule);

      return;
    }

    if ('shadow' in ability) {
      return;
    }

    if ('travel' in ability) {
      if (self.zone.type === 'stagingArea') {
        this.addCardRule(self.id, {
          travel: [ability.travel],
        });
      }

      return;
    }

    if ('attachesTo' in ability) {
      if (
        controller &&
        this.state.phase === 'planning' &&
        zone === 'hand' &&
        self.props.type === 'attachment'
      ) {
        this._modifiers.actions.push({
          description: `Play attachment ${self.props.name}`,
          source: self.id,
          action: {
            player: controller,
            action: [
              {
                card: {
                  target: self.id,
                  action: {
                    payCost: {},
                  },
                },
              },
              {
                chooseCardActions: {
                  title: 'Choose target for attachment',
                  target: ability.attachesTo,
                  action: {
                    attachCard: self.id,
                  },
                },
              },
            ],
          },
        });
      }

      return;
    }

    if ('setup' in ability) {
      this.addCardRule(self.id, {
        setup: [ability.setup],
      });

      return;
    }

    if ('multi' in ability) {
      for (const item of ability.multi) {
        this.evalAbility(self, item);
      }
      return;
    }

    if ('player' in ability) {
      if (self.zone.inPlay) {
        const condition = ability.condition
          ? this.getBool(ability.condition)
          : true;

        if (condition) {
          const players = this.getPlayers(ability.target);

          for (const player of players) {
            this.addPlayerRule(player.id, ability.player);
          }
        }
      }

      return;
    }

    if ('card' in ability) {
      if (self.zone.inPlay) {
        const condition = ability.condition
          ? this.getBool(ability.condition)
          : true;

        if (condition) {
          const cards = ability.target ? this.getCards(ability.target) : [self];

          for (const card of cards) {
            for (const modifier of asArray(ability.card)) {
              this.evalModifier(card, modifier);
            }
          }
        }
      }

      return;
    }

    throw new Error('unknown abiliy: ' + JSON.stringify(ability));
  }

  evalModifiers(): View {
    const base = this._modifiers;

    for (const card of values(this.cards)) {
      if (card.props.abilities) {
        for (const ability of card.props.abilities) {
          this.useScope({ card: { self: [card.id] } }, () =>
            this.evalAbility(card, ability)
          );
        }
      }
    }

    for (const mod of this.state.modifiers) {
      if ('card' in mod) {
        const cards = this.getCards(mod.card);
        for (const card of cards) {
          if ('increment' in mod.modifier) {
            for (const property of keys(mod.modifier.increment)) {
              const expr = mod.modifier.increment[property];
              if (expr) {
                const amount = this.getNumber(expr);
                this.addCardModifier(card.id, {
                  prop: property,
                  op: 'inc',
                  value: amount,
                });
              }
            }
            continue;
          }

          if ('add' in mod.modifier) {
            if (mod.modifier.add) {
              for (const keyword of keys(mod.modifier.add)) {
                this.addCardModifier(card.id, {
                  prop: 'keywords',
                  op: 'add',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value: mod.modifier.add[keyword] as any,
                });
              }
            }
            continue;
          }

          if ('rules' in mod.modifier) {
            this.addCardRule(card.id, mod.modifier.rules);
            continue;
          }

          throw new Error('unknown modifier :' + JSON.stringify(mod.modifier));
        }
      }
    }

    if (this.state.phase === 'planning') {
      for (const player of values(this.state.players).filter(
        (p) => !p.eliminated
      )) {
        for (const cardId of player.zones.hand.cards) {
          const card = this.cards[cardId];
          if (
            card.props.type === 'ally' &&
            card.props.sphere &&
            card.props.sphere.length > 0 &&
            typeof card.props.cost === 'number'
          ) {
            base.actions.push({
              description: `Play ally ${card.props.name}`,
              source: cardId,
              action: createPlayAllyAction(
                card.props.sphere,
                card.props.cost,
                player.id,
                cardId
              ),
            });
          }
        }
      }
    }

    return base;
  }

  get actions() {
    return this.modifiers.actions.filter((a) =>
      this.canExecute(a.action, false)
    );
  }
}
