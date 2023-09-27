import { core } from '@card-engine-nx/cards';
import { TestEngine } from './TestEngine';
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
  expect(gloin.responses?.receivedDamage?.length).toEqual(1);
  gloin.update({ dealDamage: 2 });
  expect(game.state.choice?.title).toBe(
    'Choose responses for receiving damage'
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
  console.log(game.view.actions);
  expect(game.actions.length).toEqual(1);
  game.chooseAction(action);
  console.log(game.state.choice);
  game.chooseOption('0');
  console.log(game.state.choice);
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

// it("Lelogas placing progress", async () => {
//   const game = new GameEngine({ choices: [0] });
//   const legolas = game.addHero(hero.legolas);
//   const enemy = game.addEnemy(dolGuldurOrcs);
//   const location = game.addLocation(mountainsOfMirkwood);
//   await game.execute(destroy(enemy.id, [legolas.id]));
//   expect(location.get.progress).toEqual(2);
// });

// it("Thalin damaging enemies", async () => {
//   const game = new GameEngine({ choices: [0] });
//   const thalin = game.addHero(hero.thalin);
//   await game.execute(startPhase("quest"));
//   game.update((s) => {
//     if (s.phase.type === "quest") {
//       s.phase.comitted.push(thalin.id);
//     }
//   });
//   const enemy = game.addEncounterCard(dolGuldurOrcs);
//   await game.execute(revealEncounterCards(1));
//   expect(enemy.get.damage).toEqual(1);
// });
