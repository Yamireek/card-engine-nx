import { TestEngine } from '@card-engine-nx/engine';
import { core } from '../index';
import { it, expect } from 'vitest';

it('Gimli', () => {
  const game = new TestEngine({
    players: [{ playerArea: [core.hero.gimli] }],
  });

  const gimli = game.getCard('Gimli');
  expect(gimli.props.attack).toEqual(2);
  gimli.update({ dealDamage: 1 });
  expect(gimli.props.attack).toEqual(3);
  gimli.update({ heal: 1 });
  expect(gimli.props.attack).toEqual(2);
});

it('Glorfindel', () => {
  const action =
    "Pay 1 resource from Glorfindel's pool to heal 1 damage on any character. (Limit once per round.)";

  const game = new TestEngine({
    players: [{ playerArea: [core.hero.glorfindel] }],
  });

  const glorfindel = game.getCard('Glorfindel');
  expect(game.actions.length).toEqual(0);
  glorfindel.update({ generateResources: 2 });
  expect(game.actions.length).toEqual(0);
  glorfindel.update({ dealDamage: 2 });
  expect(game.actions.length).toEqual(1);
  game.chooseAction(action);
  expect(glorfindel.token.resources).toEqual(1);
  expect(glorfindel.token.damage).toEqual(1);
  console.log(game.actions);
  console.log(game.state.cards[1]);
  expect(game.actions.length).toEqual(0);
  game.do('endRound');
  expect(game.actions.length).toEqual(1);
});

it('Gloin', () => {
  const action =
    'After Glóin suffers damage, add 1 resource to his resource pool for each point of damage he just suffered.';

  const game = new TestEngine({
    players: [{ playerArea: [core.hero.gloin] }],
  });

  const gloin = game.getCard('Glóin');
  expect(gloin.token.resources).toEqual(0);
  expect(game.view.responses.receivedDamage).toHaveLength(1);
  gloin.update({ dealDamage: 2 });
  expect(game.state.choice?.title).toBe(
    'Choose responses for event receivedDamage'
  );
  game.chooseOption(action);
  expect(gloin.token.resources).toEqual(2);
});

it('Beravor', () => {
  const action =
    'Exhaust Beravor to choose a player. That player draws 2 cards. Limit once per round.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [core.hero.beravor],
        library: [core.ally.veteranAxehand, core.ally.veteranAxehand],
      },
    ],
  });

  const player = game.getPlayer('0');
  const beravor = game.getCard('Beravor');
  expect(player.hand.cards.length).toEqual(0);
  expect(player.library.cards.length).toEqual(2);
  expect(game.actions.length).toEqual(1);
  game.chooseAction(action);
  expect(player.hand.cards.length).toEqual(2);
  expect(game.actions.length).toEqual(0);
  beravor.update('ready');
  expect(game.actions.length).toEqual(0);
});

it('Éowyn', async () => {
  const action =
    'Discard 1 card from your hand to give Éowyn +1 [willpower] until the end of the phase. This effect may be triggered by each player once each round.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [core.hero.eowyn],
        hand: [core.ally.veteranAxehand, core.ally.veteranAxehand],
      },
      {
        playerArea: [core.hero.gimli],
        hand: [core.ally.veteranAxehand],
      },
    ],
  });

  const eowyn = game.getCard('Éowyn');
  expect(eowyn.props.willpower).toEqual(4);
  expect(game.actions.length).toEqual(1);
  game.chooseAction(action);
  game.chooseOption('0');
  game.chooseOption('3');
  expect(eowyn.props.willpower).toEqual(5);
  expect(game.actions.length).toEqual(1);
  game.chooseAction(action);
  expect(eowyn.props.willpower).toEqual(6);
  expect(game.actions.length).toEqual(0);
  game.do('endPhase');
  expect(eowyn.props.willpower).toEqual(4);
  game.do('endRound');
  expect(game.actions.length).toEqual(1);
});

it('Thalin', async () => {
  const response =
    'While Thalin is committed to a quest, deal 1 damage to each enemy as it is revealed by the encounter deck.';

  const game = new TestEngine({
    players: [{ playerArea: [core.hero.thalin] }],
    encounterDeck: [core.enemy.forestSpider],
  });

  const thalin = game.getCard('Thalin');
  const enemy = game.getCard('Forest Spider');
  thalin.update({ mark: 'questing' });
  game.do('revealEncounterCard');
  game.chooseOption(response);
  console.log(enemy.state);
  expect(enemy.token.damage).toEqual(1);
});

it('Lelogas', async () => {
  const response =
    'After Legolas participates in an attack that destroys an enemy, place 2 progress tokens on the current quest.';

  const game = new TestEngine({
    players: [
      {
        playerArea: [core.hero.legolas],
        engaged: [core.enemy.dolGuldurOrcs],
      },
    ],
    activeLocation: [core.location.mountainsOfMirkwood],
  });

  const legolas = game.getCard('Legolas');
  const location = game.getCard('Mountains of Mirkwood');
  const enemy = game.getCard('Dol Guldur Orcs');
  game.do({
    card: enemy.id,
    action: {
      dealDamage: {
        amount: 5,
        attackers: [legolas.id],
      },
    },
  });
  game.chooseOption(response);
  expect(location.token.progress).toEqual(2);
});

it('Eleanor', async () => {
  const response =
    'Response: Exhaust Eleanor to cancel the "when revealed" effects of a treachery card just revealed by the encounter deck. Then, discard that card, and replace it with the next card from the encounter deck.';

  const game = new TestEngine({
    players: [
      { playerArea: [core.hero.eleanor], hand: [core.event.forGondor] },
    ],
    encounterDeck: [
      core.treachery.theNecromancersReach,
      core.treachery.eyesOfTheForest,
    ],
  });

  const hero = game.getCard('Eleanor');
  game.do('revealEncounterCard');
  game.chooseOption(response);
  expect(hero.state.tapped).toBeTruthy();
  expect(game.state.players[0]?.zones.hand.cards).toHaveLength(1);
});

it('Dúnhere', async () => {
  const game = new TestEngine({
    players: [{ playerArea: [core.hero.dunhere] }],
    stagingArea: [core.enemy.dolGuldurBeastmaster],
  });

  const enemy = game.getCard('Dol Guldur Beastmaster');
  game.do({ player: '0', action: 'resolvePlayerAttacks' });
  game.chooseOption('1');
  expect(enemy.state.token.damage).toBe(2);
});
