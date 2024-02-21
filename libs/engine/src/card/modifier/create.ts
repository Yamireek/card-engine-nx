import { Ability, GameModifier } from '@card-engine-nx/state';
import {
  CardId,
  CardType,
  Phase,
  PlayerId,
  ZoneType,
  asArray,
} from '@card-engine-nx/basic';
import { isInPlay } from '../../zone/utils';

export function createModifiers(
  self: CardId,
  controller: PlayerId | undefined,
  ability: Ability,
  phase: Phase,
  zone: ZoneType,
  type: CardType,
  name: string
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
              cost: ability.payment,
              action: {
                useScope: [
                  {
                    var: 'self',
                    card: self,
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
                        card: self,
                        action: {
                          payCost: ability.payment ?? {},
                        },
                      },
                      effect: ability.action,
                    },
                  },
                  {
                    card: self,
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
                useScope: {
                  var: 'self',
                  card: self,
                },
                action: {
                  useScope: {
                    var: 'controller',
                    player: controller,
                  },
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
        ];
      }

      if (zone === 'activeLocation' || zone === 'questArea') {
        return [
          {
            source: self,
            card: self,
            modifier: {
              description: ability.description,
              action: {
                useScope: {
                  var: 'self',
                  card: self,
                },
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
                  useScope: {
                    var: 'self',
                    card: self,
                  },
                  action: {
                    useScope: { var: 'controller', player: controller },
                    action: [
                      {
                        payment: {
                          cost: {
                            card: self,
                            action: {
                              payCost: ability.payment ?? {},
                            },
                          },
                          effect: ability.response.action,
                        },
                      },
                      {
                        card: self,
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
              },
            },
          },
        ];
      }

      if (isInPlay(zone) || zone === ability.zone) {
        return [
          {
            source: self,
            card: ability.target ?? self,
            modifier: {
              description: ability.description,
              reaction: {
                ...ability.response,
                forced: false,
                action: controller
                  ? {
                      useScope: {
                        var: 'controller',
                        player: controller,
                      },
                      action: ability.response.action,
                    }
                  : ability.response.action,
              },
            },
          },
        ];
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
      if (zone === 'encounterDeck' || zone === 'questArea') {
        return [
          {
            source: self,
            card: self,
            modifier: {
              rules: {
                whenRevealed: [
                  {
                    description: ability.description,
                    action: ability.whenRevealed,
                  },
                ],
              },
            },
          },
        ];
      }

      return [];
    }

    case 'shadow' in ability: {
      return [];
    }

    case 'rule' in ability: {
      return [
        {
          source: self,
          card: self,
          modifier: {
            description: ability.description,
            rules: ability.rule,
          },
        },
      ];
    }

    case 'travel' in ability: {
      if (zone === 'stagingArea') {
        return [
          {
            source: self,
            card: self,
            modifier: {
              description: ability.description,
              rules: {
                travel: [ability.travel],
              },
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

    case 'multi' in ability:
      return ability.multi.flatMap((a) =>
        createModifiers(self, controller, a, phase, zone, type, name)
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
              description: `Play attachment ${name}`,
              action: {
                player: controller,
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
