import { zonesEqual } from '@card-engine-nx/basic';
import { CardCtx, PlayerCtx } from './internal';

export function canEnemyAttack(enemy: CardCtx, player: PlayerCtx): boolean {
  if (enemy.rules.cantAttack || enemy.state.mark.attacked) {
    return false;
  }

  if (zonesEqual(enemy.state.zone, { player: player.id, type: 'engaged' })) {
    return true;
  }

  return false;
}

export function canCharacterAttack(
  character: CardCtx,
  enemy: CardCtx
): boolean {
  const controller = character.state.controller;

  if (!controller || character.state.tapped || enemy.state.mark.attacked) {
    return false;
  }

  if (
    zonesEqual(enemy.state.zone, {
      player: controller,
      type: 'engaged',
    })
  ) {
    return true;
  }

  const zone = enemy.zone.type;
  if (zone === 'engaged' && character.props.keywords?.ranged) {
    return true;
  }

  if (character.rules.attacksStagingArea && zone === 'stagingArea') {
    return true;
  }

  return false;
}

export function canCharacterDefend(
  character: CardCtx,
  enemy: CardCtx
): boolean {
  const controller = character.state.controller;

  if (!controller || character.state.tapped) {
    return false;
  }

  if (
    zonesEqual(enemy.state.zone, {
      player: controller,
      type: 'engaged',
    })
  ) {
    return true;
  }

  const zone = enemy.zone.type;
  if (zone === 'engaged' && character.props.keywords?.sentinel) {
    return true;
  }

  return false;
}
