import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
import { it, expect } from 'vitest';

it('Beorn', () => {
  const action =
    'Action: Beorn gains +5 Attack until the end of the phase. At the end of the phase in which you trigger this effect, shuffle Beorn back into your deck. (Limit once per round.)';

  const game = new TestEngine({
    players: [{ playerArea: [core.hero.gimli, core.ally.beorn] }],
  });

  const player = game.getPlayer('0');
  const beorn = game.getCard('Beorn');
  game.chooseAction(action);
  expect(game.actions).toHaveLength(0);
  expect(beorn.props.attack).toBe(8);
  game.do('endPhase');
  expect(player.library.cards).toHaveLength(1);
});

it('Gondorian Spearman', () => {
  const response =
    'Response: After Gondorian Spearman is declared as a defender, deal 1 damage to the attacking enemy.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 1,
          },
          core.ally.gondorianSpearman,
        ],
        engaged: [core.enemy.forestSpider],
      },
    ],
  });

  const enemy = game.getCard('Forest Spider');
  game.do({ player: { target: '0', action: 'resolveEnemyAttacks' } });
  game.chooseOption('1');
  game.chooseOption(response);
  expect(enemy.token.damage).toBe(1);
});
