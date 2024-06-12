import { Difficulty } from '@card-engine-nx/basic';
import { PlayerDeck, Scenario } from '@card-engine-nx/state';

export type ScenarioSetupData = {
  players: PlayerDeck[];
  scenario: Scenario;
  difficulty: Difficulty;
  extra: {
    resources: number;
    cards: number;
  };
};
