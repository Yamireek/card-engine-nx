import { Difficulty } from '@card-engine-nx/basic';
import { PlayerDeck, Scenario, State } from '@card-engine-nx/state';

export type GameSetupData = ScenarioSetupData | { state: State };

export type ScenarioSetupData = {
  players: PlayerDeck[];
  scenario: Scenario;
  difficulty: Difficulty;
  extra: {
    resources: number;
    cards: number;
  };
};
