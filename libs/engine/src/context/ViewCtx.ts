import { toJS } from 'mobx';
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
  CardStateModifier,
  PlayerRules,
  State,
  StateModifiers,
  mergePlayerRules,
} from '@card-engine-nx/state';
import { emptyEvents } from '../events';
import { nullLogger } from '../logger';
import { BaseCtx, CardCtx } from './internal';
import { IViewCtx } from './types';
import { getZoneType } from './utils';

export class ViewCtx extends BaseCtx implements IViewCtx {
  private readonly _modifiers: StateModifiers;

  constructor(state: State) {
    super(state, emptyEvents, noRandom(), nullLogger, false);
    this._modifiers = {
      cards: {},
      players: {},
      actions: [],
      responses: {},
    };
  }

  get modifiers(): StateModifiers {
    return this._modifiers;
  }

  addCardModifier(id: CardId, modifier: CardStateModifier) {
    if (!this._modifiers.cards[id]) {
      this._modifiers.cards[id] = [];
    }

    this._modifiers.cards[id].push(modifier);
  }

  addPlayerRule(id: PlayerId, rule: PlayerRules) {
    this._modifiers.players[id] = mergePlayerRules(
      this._modifiers.players[id],
      rule
    );
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
                property: property,
                increment: amount,
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
      this.addCardModifier(self.id, {
        rule: {
          whenRevealed: [
            {
              description: ability.description,
              action: ability.whenRevealed,
            },
          ],
        },
      });

      return;
    }

    if ('rule' in ability) {
      this.addCardModifier(self.id, {
        rule: ability.rule,
      });

      return;
    }

    if ('shadow' in ability) {
      return;
    }

    if ('travel' in ability) {
      if (self.zone.type === 'stagingArea') {
        this.addCardModifier(self.id, {
          rule: {
            travel: [ability.travel],
          },
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
          description: `Play attachment ${name}`,
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
      this.addCardModifier(self.id, {
        rule: {
          setup: [ability.setup],
        },
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
            this.addPlayerRule(player.id, ability.player.rules);
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
              if ('increment' in modifier) {
                this.evalAbility(card, {
                  description: 'todo',
                  increment: modifier.increment,
                });
              }
            }
          }
        }
      }

      return;
    }

    throw new Error('unknown abiliy: ' + JSON.stringify(ability));
  }

  evalMods(): StateModifiers {
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
                  property: property,
                  increment: amount,
                });
              }
            }
          }
        }
      }
    }

    // TODO
    return base;
  }
}
