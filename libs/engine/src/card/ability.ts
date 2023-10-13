import {
  Action,
  CardTarget,
  Ability,
  GameModifier,
} from '@card-engine-nx/state';
import {
  CardId,
  CardType,
  Phase,
  PlayerId,
  Sphere,
  ZoneType,
} from '@card-engine-nx/basic';
import { asArray, isInPlay } from '../utils';
import { isArray } from 'lodash/fp';

export function createPlayAllyAction(
  sphere: Sphere[],
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
          from: { player: owner, type: 'hand' },
          to: { player: owner, type: 'playerArea' },
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
          action: [
            {
              payment: {
                cost: payment,
                effect: [moveToPlay, { event: { type: 'played', card: self } }],
              },
            },
          ],
        },
      },
    },
  };
}

export function createPlayAttachmentAction(
  sphere: Sphere[],
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
          from: { player: owner, type: 'hand' },
          to: { player: owner, type: 'playerArea' },
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
          action: [
            {
              payment: {
                cost: payment,
                effect: [attachTo, moveToPlay],
              },
            },
          ],
        },
      },
    },
  };
}

export function createModifiers(
  self: CardId,
  controller: PlayerId | undefined,
  ability: Ability,
  phase: Phase,
  zone: ZoneType,
  type: CardType
): GameModifier[] {
  switch (true) {
    case 'increment' in ability:
      if (isInPlay(zone)) {
        return [
          {
            source: self,
            card: ability.target ?? self,
            modifier: {
              description: ability.description,
              increment: ability.increment,
            },
          },
        ];
      }

      return [];

    case 'action' in ability: {
      if (ability.phase && ability.phase !== phase) {
        return [];
      }

      if (zone === 'hand' && type === 'event' && controller) {
        return [
          {
            source: self,
            card: self,
            modifier: {
              description: ability.description,
              cost: ability.cost,
              action: {
                useCardVar: {
                  name: 'self',
                  value: self,
                  action: {
                    usePlayerVar: {
                      name: 'controller',
                      value: controller,
                      action: [
                        {
                          payment: {
                            cost: {
                              card: {
                                target: self,
                                action: {
                                  payCost: ability.cost ?? {},
                                },
                              },
                            },
                            effect: ability.action,
                          },
                        },
                        {
                          card: {
                            target: self,
                            action: {
                              move: {
                                side: 'front',
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
                        },
                      ],
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
                        ? [
                            {
                              useLimit: {
                                card: self,
                                type: ability.limit.type,
                                max: ability.limit.max,
                              },
                            },
                            ability.action,
                          ]
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

    case 'response' in ability: {
      if (zone === 'hand' && type === 'event' && controller) {
        return [
          {
            source: self,
            card: ability.target ?? self,
            modifier: {
              description: ability.description,
              reaction: {
                forced: false,
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
                        action: [
                          {
                            payment: {
                              cost: {
                                card: {
                                  target: self,
                                  action: {
                                    payCost: ability.cost ?? {},
                                  },
                                },
                              },
                              effect: ability.response.action,
                            },
                          },
                          {
                            card: {
                              target: self,
                              action: {
                                move: {
                                  side: 'front',
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
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        ];
      }

      if (isInPlay(zone) || zone === ability.zone) {
        if (controller) {
          return [
            {
              source: self,
              card: ability.target ?? self,
              modifier: {
                description: ability.description,
                reaction: {
                  ...ability.response,
                  forced: false,
                  action: {
                    usePlayerVar: {
                      name: 'controller',
                      value: controller,
                      action: ability.response.action,
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

    case 'forced' in ability:
      if (isInPlay(zone)) {
        return [
          {
            source: self,
            card: ability.target ?? self,
            modifier: {
              description: ability.description,
              reaction: { ...ability.forced, forced: true },
            },
          },
        ];
      }

      return [];

    case 'whenRevealed' in ability: {
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

    case 'travel' in ability: {
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

    case 'setup' in ability: {
      if (phase === 'setup') {
        return [
          {
            source: self,
            card: self,
            modifier: {
              description: ability.description,
              setup: ability.setup,
            },
          },
        ];
      }

      return [];
    }

    case 'nextStage' in ability: {
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

      return [];
    }

    case 'conditional' in ability: {
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

      return [];
    }

    case 'multi' in ability:
      return ability.multi.flatMap((a) =>
        createModifiers(self, controller, a, phase, zone, type)
      );

    case 'attachesTo' in ability: {
      if (
        controller &&
        phase === 'planning' &&
        zone === 'hand' &&
        type === 'attachment'
      ) {
        return [
          {
            source: self,
            card: self,
            modifier: {
              description: ability.description,
              action: {
                player: {
                  target: controller,
                  action: [
                    {
                      card: {
                        target: self,
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
                          attachCard: self,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ];
      }

      return [];
    }

    case 'player' in ability: {
      if (isInPlay(zone)) {
        return [
          {
            source: self,
            player: ability.target,
            modifier: ability.player,
            condition: ability.condition,
          },
        ];
      }

      return [];
    }

    case 'card' in ability:
      if (isInPlay(zone)) {
        return asArray(ability.card).map((modifier) => ({
          source: self,
          card: ability.target ?? self,
          modifier: modifier,
          condition: ability.condition,
        }));
      }

      return [];
    default:
      throw new Error(`unknown ability: ${JSON.stringify(ability, null, 1)}`);
  }
}
