import { Action } from '@card-engine-nx/state';
import { phaseCombat } from './combat';
import { phaseEncounter } from './encounter';
import { phasePlanning } from './planning';
import { phaseQuest } from './quest';
import { phaseRefresh } from './refresh';
import { phaseResource } from './resource';
import { phaseTravel } from './travel';

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
