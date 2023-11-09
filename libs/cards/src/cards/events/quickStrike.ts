import { event } from '@card-engine-nx/state';

// TODO custom action

export const quickStrike = event(
  {
    name: 'Quick Strike',
    cost: 1,
    sphere: 'tactics',
  },
  {
    description:
      'Action: Exhaust a character you control to immediately declare it as an attacker (and resolve its attack) against any eligible enemy target.',
    action: {
      player: 'controller',
      action: {
        chooseCardActions: {
          title: 'Choose character as attacker',
          target: {
            simple: 'character',
            controller: 'controller',
          },
          action: [
            'exhaust',
            {
              action: {
                useScope: {
                  var: 'attacker',
                  card: 'target',
                },
                action: [
                  {
                    player: 'controller',
                    action: {
                      chooseCardActions: {
                        title: 'Choose enemy to attack',
                        target: { zoneType: 'engaged' },
                        action: {
                          action: {
                            useScope: {
                              var: 'defender',
                              card: 'target',
                            },
                            action: {
                              resolveAttack: {
                                attackers: {
                                  var: 'attacker',
                                },
                                defender: { var: 'defender' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    },
  }
);
