import { Action } from '@card-engine-nx/state';
import { phaseResource } from './resource';
import { phasePlanning } from './planning';
import { phaseQuest } from './quest';
import { phaseTravel } from './travel';
import { phaseEncounter } from './encounter';
import { phaseCombat } from './combat';
import { phaseRefresh } from './refresh';

export function gameRound(): Action {
  return [
    phaseResource,
    phasePlanning,
    phaseQuest,
    phaseTravel,
    phaseEncounter,
    phaseCombat,
    phaseRefresh,
    'endRound',
  ];
}
