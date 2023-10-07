import {
  Action,
  ResponseAction,
  CardTarget,
  CardView,
  CardModifier,
  PaymentConditions,
  UserCardAction,
  Ability,
  GameModifier,
  View,
} from '@card-engine-nx/state';
import { ViewContext } from '../context';
import {
  CardId,
  GameZoneType,
  Phase,
  PlayerId,
  Sphere,
  ZoneType,
} from '@card-engine-nx/basic';
import { sequence } from '../utils/sequence';
import { getTargetCards } from './target';
import { calculateBoolExpr, calculateNumberExpr } from '../expr';
import { merge } from 'lodash';
import { getTargetPlayers } from '../player/target';
import { applyPlayerModifier } from '../player/modifier';

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
  ability: CardModifier,
  action: Action,
  self: CardView,
  controller: PlayerId,
  phase: Phase
): UserCardAction[] {
  return [];

  // if (self.zone === 'hand' && self.props.type === 'event') {
  //   if (!ability.phase || ability.phase === phase) {
  //     const eventAction = createEventAction(
  //       self,
  //       ability.payment,
  //       action,
  //       controller
  //     );

  //     if (eventAction) {
  //       return [
  //         {
  //           action: eventAction,
  //           card: self.id,
  //           description: ability.description,
  //         },
  //       ];
  //     }
  //   }
  // }

  // if (self.zone === 'playerArea') {
  //   if (!ability.phase || ability.phase === phase) {
  //     return [
  //       {
  //         description: ability.description,
  //         card: self.id,
  //         action: {
  //           useCardVar: {
  //             name: 'self',
  //             value: self.id,
  //             action: {
  //               usePlayerVar: {
  //                 name: 'controller',
  //                 value: controller,
  //                 action: sequence(
  //                   {
  //                     useLimit: {
  //                       type: ability.limit ?? 'none',
  //                       card: self.id,
  //                       index: 0, // TODO ability index
  //                     },
  //                   },
  //                   action
  //                 ),
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ];
  //   }
  // }

  // return [];
}

export function applyModifier(
  modifier: CardModifier,
  self: CardView,
  ctx: ViewContext
) {
  // if (ability.target) {
  //   const targets = getTargetCards(ability.target, ctx);
  //   for (const id of targets) {
  //     const card = ctx.view.cards[id];
  //     applyAbility({ ...ability, target: undefined }, card, ctx);
  //   }
  //   return;
  // }

  if (modifier.bonus) {
    const targets = modifier.target
      ? getTargetCards(modifier.target, ctx)
      : getTargetCards(self.id, ctx);

    for (const id of targets) {
      const amount = calculateNumberExpr(modifier.bonus.amount, ctx);
      const card = ctx.view.cards[id];
      const value = card.props[modifier.bonus.property];
      if (value !== undefined && amount) {
        card.props[modifier.bonus.property] = value + amount;
      }
    }

    return;
  }

  if (modifier.nextStage) {
    self.nextStage = modifier.nextStage;
    return;
  }

  // if (modifier.disable) {
  //   if (!self.disabled) {
  //     self.disabled = {};
  //   }

  //   self.disabled[modifier.disable] = true;
  //   return;
  // }

  if (modifier.setup) {
    ctx.view.setup.push(modifier.setup);
    return;
  }

  // if (modifier.action) {
  //   const controller = ctx.state.cards[self.id].controller;
  //   if (controller) {
  //     const actions = createCardActions(
  //       modifier,
  //       modifier.action,
  //       self,
  //       controller,
  //       ctx.state.phase
  //     );
  //     ctx.view.actions.push(...actions);
  //   }
  //   return;
  // }

  // if (modifier.attachesTo) {
  //   self.attachesTo = modifier.attachesTo;
  //   return;
  // }

  if (modifier.forced) {
    if (!ctx.view.responses[modifier.forced.event]) {
      ctx.view.responses[modifier.forced.event] = [];
    }

    ctx.view.responses[modifier.forced.event]?.push({
      card: self.id,
      description: modifier.description,
      action: modifier.forced.action,
      condition: modifier.forced.condition,
      forced: true,
    });
    return;
  }

  if (modifier.response) {
    if (!ctx.view.responses[modifier.response.event]) {
      ctx.view.responses[modifier.response.event] = [];
    }

    if (self.props.type === 'event' && self.zone === 'hand') {
      const controller = ctx.state.cards[self.id].controller;
      if (controller) {
        const response = createEventResponse(
          self,
          modifier.response,
          controller
        );

        if (response) {
          ctx.view.responses[modifier.response.event]?.push({
            card: self.id,
            description: modifier.description,
            action: response,
            condition: modifier.response.condition,
            forced: false,
          });
        }
      }
    } else {
      ctx.view.responses[modifier.response.event]?.push({
        card: self.id,
        description: modifier.description,
        action: modifier.response.action,
        condition: modifier.response.condition,
        forced: false,
      });
    }

    return;
  }

  if (modifier.whenRevealed) {
    self.whenRevealed.push(modifier.whenRevealed);
    return;
  }

  if (modifier.conditional) {
    if (modifier.conditional.advance !== undefined) {
      self.conditional.advance.push(modifier.conditional.advance);
      return;
    }
    // if (modifier.conditional.travel !== undefined) {
    //   self.conditional.travel.push(modifier.conditional.travel);
    //   return;
    // }
  }

  // if (ability.and) {
  //   for (const item of ability.and) {
  //     applyAbility({ ...item, description: ability.description }, self, ctx);
  //   }

  //   return;
  // }

  // if (ability.if) {
  //   const condition = calculateBoolExpr(ability.if.condition, ctx);
  //   if (condition) {
  //     applyAbility(ability.if.modifier, self, ctx);
  //   }
  //   return;
  // }

  // if (modifier.keywords) {
  //   merge(self.props.keywords, modifier.keywords);
  //   // TODO number keywords
  //   return;
  // }

  // if (modifier.travel) {
  //   self.travel.push(modifier.travel);
  //   return;
  // }

  // if (modifier.player) {
  //   const players = getTargetPlayers(modifier.player.target, ctx);
  //   for (const playerId of players) {
  //     const player = ctx.view.players[playerId];
  //     if (player) {
  //       applyPlayerModifier(player, modifier.player.modifier);
  //     }
  //   }
  //   return;
  // }

  // if (modifier.refreshCost) {
  //   self.refreshCost.push(modifier.refreshCost);
  //   return;
  // }

  if (modifier.action) {
    ctx.view.actions.push({
      card: self.id,
      description: modifier.description,
      action: modifier.action,
    });
    return;
  }

  console.log(`unknown modifier: ${JSON.stringify(modifier, null, 1)}`);
  //throw new Error(`unknown modifier: ${JSON.stringify(modifier)}`);
}

export function createModifiers(
  self: CardId,
  controller: PlayerId | undefined,
  ability: Ability,
  phase: Phase,
  zone: ZoneType
): GameModifier[] {
  if ('bonus' in ability) {
    if (zone === 'playerArea') {
      return [
        {
          source: self,
          card: ability.target ?? self,
          modifier: {
            description: ability.description,
            bonus: ability.bonus,
          },
        },
      ];
    }

    return [];
  }

  if ('action' in ability) {
    if (zone === 'hand' && controller) {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            action: {
              useCardVar: {
                name: 'self',
                value: self,
                action: {
                  usePlayerVar: {
                    name: 'controller',
                    value: controller,
                    action: sequence(
                      {
                        payment: {
                          cost: {
                            card: {
                              target: self,
                              action: 'payCost',
                            },
                          },
                          effect: ability.action,
                        },
                      },
                      {
                        card: { target: self, action: 'discard' },
                      }
                    ),
                  },
                },
              },
            },
          },
        },
      ];
    }

    if (zone === 'playerArea' && controller) {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            action: {
              useCardVar: {
                name: 'self',
                value: self,
                action: {
                  usePlayerVar: {
                    name: 'controller',
                    value: controller,
                    action: ability.limit
                      ? {
                          sequence: [
                            {
                              useLimit: {
                                card: self,
                                type: ability.limit,
                                index: 0, // TODO index
                              },
                            },
                            ability.action,
                          ],
                        }
                      : ability.action,
                  },
                },
              },
            },
          },
        },
      ];
    }

    return [];
  }

  if ('response' in ability) {
    if (zone === 'hand' && controller) {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            response: {
              event: ability.response.event,
              condition: ability.response.condition,
              action: {
                useCardVar: {
                  name: 'self',
                  value: self,
                  action: {
                    usePlayerVar: {
                      name: 'controller',
                      value: controller,
                      action: sequence(
                        {
                          payment: {
                            cost: {
                              card: {
                                target: self,
                                action: 'payCost',
                              },
                            },
                            effect: ability.response.action,
                          },
                        },
                        {
                          card: { target: self, action: 'discard' },
                        }
                      ),
                    },
                  },
                },
              },
            },
          },
        },
      ];
    }

    if (zone === 'playerArea') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            response: ability.response,
          },
        },
      ];
    }

    return [];
  }

  if ('forced' in ability) {
    if (zone === 'engaged' || zone === 'playerArea' || zone === 'questArea') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            forced: ability.forced,
          },
        },
      ];
    }

    return [];
  }

  if ('whenRevealed' in ability) {
    if (zone === 'encounterDeck') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            whenRevealed: ability.whenRevealed,
          },
        },
      ];
    }

    return [];
  }

  if ('travel' in ability) {
    if (zone === 'stagingArea') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            travel: ability.travel,
          },
        },
      ];
    }

    return [];
  }

  if ('setup' in ability) {
    return [
      {
        source: self,
        card: self,
        modifier: { description: ability.description, setup: ability.setup },
      },
    ];
  }

  if ('nextStage' in ability) {
    if (zone === 'questArea') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            nextStage: ability.nextStage,
          },
        },
      ];
    }
  }

  if ('conditional' in ability) {
    if (zone === 'questArea') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            conditional: ability.conditional,
          },
        },
      ];
    }
  }

  if ('multi' in ability) {
    return ability.multi.flatMap((a) =>
      createModifiers(self, controller, a, phase, zone)
    );
  }

  if ('attachesTo' in ability) {
    if (zone === 'hand') {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            attachesTo: ability.attachesTo,
          },
        },
      ];
    }

    return [];
  }

  console.log(`unknown ability: ${JSON.stringify(ability, null, 1)}`);

  return [];
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
