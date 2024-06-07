import { CardId, keys, noRandom, values } from "@card-engine-nx/basic";
import {
  Ability,
  CardStateModifier,
  State,
  StateModifiers,
} from "@card-engine-nx/state";
import { emptyEvents } from "../events";
import { nullLogger } from "../logger";
import { BaseCtx, CardCtx } from "./internal";
import { IViewCtx } from "./types";
import { getZoneType } from "./utils";
import { toJS } from "mobx";

export class ViewCtx extends BaseCtx implements IViewCtx {
  private readonly _modifiers: StateModifiers;

  constructor(state: State) {
    super(state, emptyEvents, noRandom(), nullLogger, false);
    this._modifiers = {
      cards: {},
      actions: [],
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

  evalAbility(self: CardCtx, ability: Ability) {
    if ("increment" in ability) {
      const targets = ability.target ? this.getCards(ability.target) : [self];
      for (const property of keys(ability.increment)) {
        const expr = ability.increment[property];
        if (expr) {
          const amount = this.getNumber(expr);
          for (const target of targets) {
            this.addCardModifier(target.id, {
              property: property,
              increment: amount,
            });
          }
        }
      }
      return;
    }

    if ("action" in ability) {
      if (ability.phase && ability.phase !== this.state.phase) {
        return;
      }

      const controller = self.state.controller;
      const zone = getZoneType(self.state.zone);
      if (zone === "playerArea" && controller) {
        this._modifiers.actions.push({
          source: self.id,
          description: ability.description,
          action: {
            useScope: {
              var: "controller",
              player: controller,
            },
            action: {
              useScope: {
                var: "self",
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
    }

    throw new Error("unknown abiliy: " + JSON.stringify(ability));
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
      if ("card" in mod) {
        const cards = this.getCards(mod.card);
        for (const card of cards) {
          if ("increment" in mod.modifier) {
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
