import { ally } from '@card-engine-nx/state';

export const beorn = ally(
  {
    name: 'Beorn',
    unique: true,
    cost: 6,
    willpower: 1,
    attack: 3,
    defense: 3,
    hitPoints: 6,
    traits: ['beorning', 'warrior'],
    sphere: 'tactics',
  },
  {
    description:
      'Action: Beorn gains +5 Attack until the end of the phase. At the end of the phase in which you trigger this effect, shuffle Beorn back into your deck. (Limit once per round.)',
    limit: { max: 1, type: 'round' },
    action: [
      {
        card: 'self',
        action: {
          modify: {
            increment: {
              attack: 5,
            },
          },
          until: 'end_of_phase',
        },
      },
      {
        atEndOfPhase: {
          card: {
            name: 'Beorn',
            simple: 'inAPlay',
          },
          action: 'shuffleToDeck',
        },
      },
    ],
  }
);
