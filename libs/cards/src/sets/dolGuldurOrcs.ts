import { EncounterSet } from '@card-engine-nx/state';
import * as enemy from '../cards/enemies';
import * as location from '../cards/locations';
import * as treachery from '../cards/treacheries';

export const dolGuldurOrcs: EncounterSet = {
  easy: [
    enemy.dolGuldurOrcs,
    enemy.dolGuldurOrcs,
    enemy.dolGuldurOrcs,
    enemy.dolGuldurBeastmaster,
    treachery.drivenByShadow,
    treachery.theNecromancersReach,
    location.necromancersPass,
    location.enchantedStream,
    location.enchantedStream,
  ],
  normal: [
    enemy.chieftanUfthak,
    enemy.dolGuldurBeastmaster,
    treachery.theNecromancersReach,
    treachery.theNecromancersReach,
    location.necromancersPass,
  ],
};
