import { TestEngine, getZoneType } from '@card-engine-nx/engine';
import { it, suite, expect } from 'vitest';
import { core } from '../index';

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
  game.do({ player: '0', action: 'resolveEnemyAttacks' });
  game.chooseOption('2');
  game.chooseOption(response);
  expect(enemy.token.damage).toBe(1);
});

it('Gandalf', () => {
  const response =
    'Response: After Gandalf enters play, (choose 1): draw 3 cards, deal 4 damage to 1 enemy in play, or reduce your threat by 5.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 5,
          },
        ],
        hand: [core.ally.gandalf],
      },
    ],
  });

  const gandalf = game.getCard('Gandalf');
  game.do({ beginPhase: 'planning' });
  game.chooseAction('Play ally Gandalf');
  game.chooseOption(response);
  expect(game.state.players['0']?.thread).toBe(-5);
  game.do('endRound');
  expect(getZoneType(gandalf.state.zone)).toBe('discardPile');
});
