import {
  Action,
  ResponseAction,
  CardTarget,
  CardView,
  Modifier,
  PaymentConditions,
  UserCardAction,
} from '@card-engine-nx/state';
import { ViewContext } from '../context';
import { CardId, Phase, PlayerId, Sphere } from '@card-engine-nx/basic';
import { sequence } from '../utils/sequence';
import { getTargetCards } from './target';
import { calculateBoolExpr, calculateNumberExpr } from '../expr';
import { merge } from 'lodash';

export function createPlayAllyAction(
  sphere: Sphere,
  cost: number,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const moveToPlay: Action = {
    card: {
      target: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'playerArea' },
          side: 'front',
        },
      },
    },
  };

  return {
    useCardVar: {
      name: 'self',
      value: self,
      action: {
        usePlayerVar: {
          name: 'controller',
          value: owner,
          action: sequence({ payment: { cost: payment, effect: moveToPlay } }),
        },
      },
    },
  };
}

export function createPlayAttachmentAction(
  sphere: Sphere,
  cost: number,
  attachesTo: CardTarget,
  owner: PlayerId,
  self: CardId
): Action {
  const payment: Action = {
    player: {
      target: owner,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const attachTo: Action = {
    player: {
      target: owner,
      action: {
        chooseCardActions: {
          title: 'Choose target for attachment',
          multi: false,
          optional: false,
          target: {
            and: [attachesTo, 'inAPlay'],
          },
          action: {
            attachCard: self,
          },
        },
      },
    },
  };

  const moveToPlay: Action = {
    card: {
      target: self,
      action: {
        move: {
          from: { owner, type: 'hand' },
          to: { owner, type: 'playerArea' },
          side: 'front',
        },
      },
    },
  };

  return {
    useCardVar: {
      name: 'self',
      value: self,
      action: {
        usePlayerVar: {
          name: 'controller',
          value: owner,
          action: sequence({
            payment: { cost: payment, effect: sequence(attachTo, moveToPlay) },
          }),
        },
      },
    },
  };
}

export function createCardActions(
  ability: Modifier,
  action: Action,
  self: CardView,
  controller: PlayerId,
  phase: Phase
): UserCardAction[] {
  if (self.zone === 'hand' && self.props.type === 'event') {
    if (!ability.phase || ability.phase === phase) {
      const eventAction = createEventAction(
        self,
        ability.payment,
        action,
        controller
      );

      if (eventAction) {
        return [
          {
            action: eventAction,
            card: self.id,
            description: ability.description,
          },
        ];
      }
    }
  }

  if (self.zone === 'playerArea') {
    if (!ability.phase || ability.phase === phase) {
      return [
        {
          description: ability.description,
          card: self.id,
          action: {
            useCardVar: {
              name: 'self',
              value: self.id,
              action: {
                usePlayerVar: {
                  name: 'controller',
                  value: controller,
                  action: sequence(
                    {
                      useLimit: {
                        type: ability.limit ?? 'none',
                        card: self.id,
                        index: 0, // TODO ability index
                      },
                    },
                    action
                  ),
                },
              },
            },
          },
        },
      ];
    }
  }

  return [];
}

export function applyAbility(
  ability: Modifier,
  self: CardView,
  ctx: ViewContext
) {
  self.abilities.push(ability.description);

  if (ability.bonus) {
    const targets = ability.target
      ? getTargetCards(ability.target, ctx)
      : getTargetCards(self.id, ctx);

    for (const id of targets) {
      const amount = calculateNumberExpr(ability.bonus.amount, ctx);
      const card = ctx.view.cards[id];
      const value = card.props[ability.bonus.property];
      if (value !== undefined && amount) {
        card.props[ability.bonus.property] = value + amount;
      }
    }

    return;
  }

  if (ability.nextStage) {
    self.nextStage = ability.nextStage;
    return;
  }

  if (ability.disable) {
    if (!self.disabled) {
      self.disabled = {};
    }

    self.disabled[ability.disable] = true;
    return;
  }

  if (ability.setup) {
    ctx.view.setup.push(ability.setup);
    return;
  }

  if (ability.action) {
    const controller = ctx.state.cards[self.id].controller;
    if (controller) {
      const actions = createCardActions(
        ability,
        ability.action,
        self,
        controller,
        ctx.state.phase
      );
      ctx.view.actions.push(...actions);
    }
    return;
  }

  if (ability.attachesTo) {
    self.attachesTo = ability.attachesTo;
    return;
  }

  if (ability.forced) {
    if (!ctx.view.responses[ability.forced.event]) {
      ctx.view.responses[ability.forced.event] = [];
    }

    ctx.view.responses[ability.forced.event]?.push({
      card: self.id,
      description: ability.description,
      action: ability.forced.action,
      condition: ability.forced.condition,
      forced: true,
    });
    return;
  }

  if (ability.response) {
    if (!ctx.view.responses[ability.response.event]) {
      ctx.view.responses[ability.response.event] = [];
    }

    if (self.props.type === 'event' && self.zone === 'hand') {
      const controller = ctx.state.cards[self.id].controller;
      if (controller) {
        const response = createEventResponse(
          self,
          ability.response,
          controller
        );

        if (response) {
          ctx.view.responses[ability.response.event]?.push({
            card: self.id,
            description: ability.description,
            action: response,
            condition: ability.response.condition,
            forced: false,
          });
        }
      }
    }

    if (self.zone === 'playerArea') {
      ctx.view.responses[ability.response.event]?.push({
        card: self.id,
        description: ability.description,
        action: ability.response.action,
        condition: ability.response.condition,
        forced: false,
      });
    }

    return;
  }

  if (ability.whenRevealed) {
    self.whenRevealed.push(ability.whenRevealed);
    return;
  }

  if (ability.conditional) {
    if (ability.conditional.advance !== undefined) {
      self.conditional.advance.push(ability.conditional.advance);
      return;
    }
    if (ability.conditional.travel !== undefined) {
      self.conditional.travel.push(ability.conditional.travel);
      return;
    }
  }

  if (ability.and) {
    for (const item of ability.and) {
      applyAbility({ ...item, description: ability.description }, self, ctx);
    }

    return;
  }

  if (ability.if) {
    const condition = calculateBoolExpr(ability.if.condition, ctx);
    if (condition) {
      applyAbility(ability.if.modifier, self, ctx);
    }
    return;
  }

  if (ability.keywords) {
    merge(self.props.keywords, ability.keywords);
    // TODO number keywords
    return;
  }

  throw new Error(`unknown ability: ${JSON.stringify(ability)}`);
}

export function createEventResponse(
  self: CardView,
  response: ResponseAction,
  controller: PlayerId
) {
  const sphere = self.props.sphere;
  const cost = self.props.cost;

  if (sphere === undefined || cost === undefined) {
    return;
  }

  const payment: Action = {
    player: {
      target: controller,
      action: { payResources: { amount: cost, sphere } },
    },
  };

  const discard: Action = {
    card: {
      target: self.id,
      action: {
        move: {
          from: { owner: controller, type: 'hand' },
          to: { owner: controller, type: 'discardPile' },
          side: 'front',
        },
      },
    },
  };

  return {
    useCardVar: {
      name: 'self',
      value: self.id,
      action: {
        usePlayerVar: {
          name: 'controller',
          value: controller,
          action: sequence(
            { payment: { cost: payment, effect: response.action } },
            discard
          ),
        },
      },
    },
  };
}

export function createEventAction(
  self: CardView,
  conditions: PaymentConditions | undefined,
  action: Action,
  controller: PlayerId
): Action | undefined {
  const sphere = self.props.sphere;
  const cost = self.props.cost;

  if (sphere === undefined || cost === undefined) {
    return;
  }

  const payment: Action = {
    player: {
      target: controller,
      action: { payResources: { ...conditions, amount: cost, sphere } },
    },
  };

  const discard: Action = {
    card: {
      target: self.id,
      action: {
        move: {
          from: { owner: controller, type: 'hand' },
          to: { owner: controller, type: 'discardPile' },
          side: 'front',
        },
      },
    },
  };

  return {
    useCardVar: {
      name: 'self',
      value: self.id,
      action: {
        usePlayerVar: {
          name: 'controller',
          value: controller,
          action: sequence(
            { payment: { cost: payment, effect: action } },
            discard
          ),
        },
      },
    },
  };
}
