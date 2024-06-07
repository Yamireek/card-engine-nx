import { it, expect } from 'vitest';
import { TestEngine } from '@card-engine-nx/engine';
import { core } from '../index';

it('Blade Mastery', () => {
  const action =
    'Action: Choose a character. Until the end of the phase, that character gains +1 [attack] and +1 [defense].';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 1,
          },
        ],
        hand: [core.event.bladeMastery],
      },
    ],
  });

  const hero = game.card('Gimli');
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
  game.chooseAction(action);
  expect(hero.props.attack).toEqual(3);
  expect(hero.props.defense).toEqual(3);
  game.do('endPhase');
  expect(hero.props.attack).toEqual(2);
  expect(hero.props.defense).toEqual(2);
});

it('Feint', () => {
  const action =
    'Combat Action: Choose an enemy engaged with a player. That enemy cannot attack that player this phase.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
        ],
        hand: [core.event.feint],
        engaged: [core.enemy.dolGuldurOrcs],
      },
    ],
  });

  expect(game.actions.length).toBe(0);
  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  game.do({ player: '0', action: 'resolveEnemyAttacks' });
  expect(game.state.choice).toBeUndefined();
  game.do('endPhase');
  game.do({ player: '0', action: 'resolveEnemyAttacks' });
  expect(game.choiceTitle).toBe('Declare defender');
});

it('Rain of Arrows', () => {
  const action =
    'Action: Exhaust a character you control with the ranged keyword to choose a player. Deal 1 damage to each enemy engaged with that player.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
        ],
        hand: [core.event.rainOfArrows],
        engaged: [core.enemy.dolGuldurOrcs, core.enemy.kingSpider],
      },
    ],
  });

  const enemy1 = game.card('Dol Guldur Orcs');
  const enemy2 = game.card('King Spider');
  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  expect(enemy1.state.token.damage).toBe(1);
  expect(enemy2.state.token.damage).toBe(1);
});

it('Thicket of Spears', () => {
  const action =
    "You must use resources from 3 different heroes' pools to pay for this card. Action: Choose a player. That player's engaged enemies cannot attack that player this phase.";

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
          {
            card: core.hero.gimli,
            resources: 1,
          },
          {
            card: core.hero.thalin,
            resources: 1,
          },
        ],
        hand: [core.event.thicketOfSpears],
        engaged: [core.enemy.dolGuldurOrcs],
      },
    ],
  });

  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  game.do({ player: '0', action: 'resolveEnemyAttacks' });
  expect(game.state.choice).toBeUndefined();
  game.do('endPhase');
  game.do({ player: '0', action: 'resolveEnemyAttacks' });
  expect(game.choiceTitle).toBe('Declare defender');
});

it('Quick Strike', () => {
  const action =
    'Action: Exhaust a character you control to immediately declare it as an attacker (and resolve its attack) against any eligible enemy target.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 1,
          },
        ],
        hand: [core.event.quickStrike],
        engaged: [core.enemy.forestSpider],
      },
    ],
  });

  const enemy = game.card('Forest Spider');
  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  expect(enemy.token.damage).toBe(1);
});

it('Stand Together', () => {
  const action =
    'Action: Choose a player. That player may declare any number of his eligible characters as defenders against each enemy attacking him this phase.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.legolas,
            resources: 1,
          },
          core.ally.veteranAxehand,
        ],
        hand: [core.event.standTogether],
        engaged: [core.enemy.ungoliantsSpawn],
      },
    ],
  });

  const hero = game.card('Legolas');
  const enemy = game.card("Ungoliant's Spawn");
  game.do({ beginPhase: 'combat' });
  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  game.do({
    card: enemy.id,
    action: { resolveEnemyAttacking: '0' },
  });
  game.chooseOptions(['1', '2']);
  game.chooseOption('1');
  expect(hero.token.damage).toBe(3);
  game.do('endPhase');
  //expect(game.view.players[0]?.rules.multipleDefenders).toBeUndefined(); TODO
});

it('Swift Strike', () => {
  const response =
    'Response: After a character is declared as a defender, deal 2 damage to the attacking enemy.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gimli,
            resources: 2,
          },
        ],
        hand: [core.event.swiftStrike],
        engaged: [core.enemy.forestSpider],
      },
    ],
  });

  const enemy = game.card('Forest Spider');
  game.do({ player: '0', action: 'resolveEnemyAttacks' });
  game.chooseOption('1');
  game.chooseOption(response);
  expect(enemy.token.damage).toBe(2);
});

it('Common Cause', () => {
  const action =
    'Action: Exhaust 1 hero you control to choose and ready a different hero.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.gloin,
            exhausted: true,
          },
          core.hero.aragorn,
        ],
        hand: [core.event.commonCause],
      },
    ],
  });

  const aragorn = game.card('Aragorn');
  const gloin = game.card('Glóin');

  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  expect(aragorn.state.tapped).toBe(true);
  expect(gloin.state.tapped).toBe(false);
});

it('Fortune or Fate', () => {
  const action =
    "Action: Choose a hero in any player's discard pile. Put that card into play, under its owner's control.";

  const game = new TestEngine({
    players: [
      {
        playerArea: [
          {
            card: core.hero.eleanor,
            resources: 5,
          },
        ],
        hand: [core.event.fortuneOrFate],
      },
      {
        playerArea: [core.hero.gimli],
        discardPile: [core.hero.legolas],
      },
    ],
  });

  const legolas = game.card('Legolas');

  expect(game.actions.length).toBe(1);
  game.chooseAction(action);
  expect(legolas.state.zone).toEqual({ player: '1', type: 'playerArea' });
});
