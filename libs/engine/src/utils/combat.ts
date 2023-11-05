import { CardId, PlayerId, zonesEqual } from '@card-engine-nx/basic';
import { ViewContext } from '../context/view';
import { getCard } from '../context/utils';
import { getZoneType } from '../zone/utils';

export function canEnemyAttack(
  enemyId: CardId,
  playerId: PlayerId,
  ctx: ViewContext
): boolean {
  const enemy = getCard(enemyId, ctx);

  if (enemy.view.rules.cantAttack || enemy.state.mark.attacked) {
    return false;
  }

  if (zonesEqual(enemy.state.zone, { player: playerId, type: 'engaged' })) {
    return true;
  }

  return false;
}

export function canCharacterAttack(
  characterId: CardId,
  enemyId: CardId,
  ctx: ViewContext
): boolean {
  const character = getCard(characterId, ctx);
  const enemy = getCard(enemyId, ctx);
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

  const zone = getZoneType(enemy.state.zone);
  if (zone === 'engaged' && character.view.props.keywords?.ranged) {
    return true;
  }

  if (character.view.rules.attacksStagingArea && zone === 'stagingArea') {
    return true;
  }

  return false;
}

export function canCharacterDefend(
  characterId: CardId,
  enemyId: CardId,
  ctx: ViewContext
): boolean {
  const character = getCard(characterId, ctx);
  const enemy = getCard(enemyId, ctx);
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

  const zone = getZoneType(enemy.state.zone);
  if (zone === 'engaged' && character.view.props.keywords?.sentinel) {
    return true;
  }

  return false;
}
