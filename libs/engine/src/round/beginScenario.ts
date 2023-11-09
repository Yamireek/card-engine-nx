import { Action } from '@card-engine-nx/state';
import { ScenarioSetupData } from '../GameSetupData';
import { gameRound } from './gameRound';

export function beginScenario(data: ScenarioSetupData): Action {
  return [
    ...data.players.map((d) => ({ addPlayer: d })),
    {
      setupScenario: { scenario: data.scenario, difficulty: data.difficulty },
    },
    'shuffleEncounterDeck',
    {
      player: 'each',
      action: 'shuffleLibrary',
    },
    {
      player: 'each',
      action: {
        draw: 6 + data.extra.cards,
      },
    },
    {
      card: { type: 'hero' },
      action: { generateResources: data.extra.resources },
    },
    {
      card: {
        target: { top: 'questDeck' },
        action: {
          move: {
            from: 'questDeck',
            to: 'questArea',
          },
        },
      },
    },
    'setup',
    gameRound(),
  ];
}
