import {
  Action,
  Choice,
  Scope,
  createCardState,
  createPlayerState,
} from '@card-engine-nx/state';
import { getTargetPlayer } from '../player/target/single';
import { getTargetPlayers } from '../player/target/multi';
import { executePlayerAction } from '../player/action/execute';
import { isArray, keys, last, reverse, sum } from 'lodash/fp';
import { CardId, values } from '@card-engine-nx/basic';
import { addPlayerCard, addGameCard } from '../utils';
import { calculateBoolExpr } from '../expression/bool/calculate';
import { calculateNumberExpr } from '../expression/number/calculate';
import { updatedCtx } from '../context/update';
import { ExecutionContext } from '../context/execution';
import { canExecute } from './executable';
import { executeCardAction } from '../card/action/execute';
import { getTargetCards } from '../card/target/multi';
import { getTargetCard } from '../card/target/single';
import { executeScopeAction } from '../scope/execute';
import { gameRound } from '../round/gameRound';
import { getZoneState } from '../zone';
import { abilityToModifiers, createModifiers } from '../card';

export function executeAction(
  action: Action,
  ctx: ExecutionContext
): undefined | boolean {
  if (isArray(action)) {
    ctx.state.next.unshift(...action);
    return;
  }

  if (action === 'empty') {
    return;
  }

  if (action === 'shuffleEncounterDeck') {
    const zone = ctx.state.zones.encounterDeck;
    zone.cards = ctx.random.shuffle(zone.cards);
    return;
  }

  if (action === 'setup') {
    ctx.state.next.unshift();
    ctx.state.next.unshift(
      {
        choice: {
          id: ctx.state.nextId++,
          title: 'Setup',
          type: 'show',
          cardId: ctx.state.zones.questArea.cards[0] ?? 0,
        },
      },
      ...ctx.view.setup,
      {
        card: {
          zone: 'questArea',
        },
        action: {
          flip: 'back',
        },
      },
      {
        choice: {
          id: ctx.state.nextId++,
          title: 'Setup',
          type: 'show',
          cardId: ctx.state.zones.questArea.cards[0] ?? 0,
        },
      }
    );
    return;
  }

  if (action === 'endRound') {
    ctx.state.actionLimits = ctx.state.actionLimits.filter(
      (l) => l.type !== 'round'
    );

    for (const player of values(ctx.state.players)) {
      for (const limit of keys(player.limits)) {
        if (player.limits[limit].type === 'round') {
          delete player.limits[limit];
        }
      }
    }

    ctx.state.modifiers = ctx.state.modifiers.filter(
      (m) => m.until !== 'end_of_round'
    );

    ctx.state.next.unshift({ event: { type: 'end_of_round' } }, gameRound());
    ctx.state.triggers.end_of_round = [];
    ctx.state.round++;
    return;
  }

  if (action === 'endPhase') {
    ctx.state.actionLimits = ctx.state.actionLimits.filter(
      (l) => l.type !== 'phase'
    );

    for (const player of values(ctx.state.players)) {
      for (const limit of keys(player.limits)) {
        if (player.limits[limit].type === 'phase') {
          delete player.limits[limit];
        }
      }
    }

    ctx.state.modifiers = ctx.state.modifiers.filter(
      (m) => m.until !== 'end_of_phase'
    );

    ctx.state.next.unshift(...ctx.state.triggers.end_of_phase);
    ctx.state.triggers.end_of_phase = [];
    return;
  }

  if (action === 'chooseTravelDestination') {
    const existing = getTargetCards({ zoneType: 'activeLocation' }, ctx);
    if (existing.length > 0) {
      return;
    }

    ctx.state.next.unshift({
      player: 'first',
      action: {
        chooseCardActions: {
          title: 'Choose location for travel',
          target: {
            zone: 'stagingArea',
            type: 'location',
          },
          action: 'travel',
          optional: true,
        },
      },
    });
    return;
  }

  if (action === 'dealShadowCards') {
    ctx.state.next.unshift({
      card: { type: 'enemy', zoneType: 'engaged' },
      action: 'dealShadowCard',
    });
    return;
  }

  if (action === 'passFirstPlayerToken') {
    const next = getTargetPlayer('next', ctx);
    ctx.state.firstPlayer = next;
    return;
  }

  if (action === 'resolveQuesting') {
    const totalWillpower = calculateNumberExpr(
      {
        card: {
          target: { mark: 'questing' },
          value: 'willpower',
          sum: true,
        },
      },
      ctx
    );

    const totalThreat = calculateNumberExpr('totalThreat', ctx);

    const diff = totalWillpower - totalThreat;
    if (diff > 0) {
      ctx.state.next = [{ placeProgress: diff }, ...ctx.state.next];
    }
    if (diff < 0) {
      ctx.state.next = [
        { player: 'each', action: { incrementThreat: -diff } },
        ...ctx.state.next,
      ];
    }
    return;
  }

  if (action === 'revealEncounterCard') {
    const card = getTargetCard({ top: 'encounterDeck' }, ctx);

    if (!card) {
      if (ctx.state.zones.discardPile.cards.length > 0) {
        ctx.state.next.unshift(
          {
            card: {
              zone: 'discardPile',
            },
            action: {
              move: {
                to: 'encounterDeck',
                side: 'back',
              },
            },
          },
          'shuffleEncounterDeck',
          'revealEncounterCard'
        );
      }

      return;
    }

    ctx.state.next.unshift({
      card,
      action: 'reveal',
    });

    return;
  }

  if (action === 'win') {
    const playerScores = values(ctx.state.players).map((p) => {
      const threat = p.thread;
      const deadHeroes = getTargetCards(
        {
          zone: { player: p.id, type: 'discardPile' },
          type: 'hero',
        },
        ctx
      ).map((id) => ctx.state.cards[id]);

      const aliveHeroes = getTargetCards(
        {
          zone: { player: p.id, type: 'discardPile' },
          type: 'hero',
        },
        ctx
      ).map((id) => ctx.state.cards[id]);

      return (
        threat +
        sum(deadHeroes.map((h) => h.definition.front.threatCost)) +
        sum(aliveHeroes.map((h) => h.token.damage))
      );
    });

    const victoryCards = getTargetCards(
      {
        zoneType: 'victoryDisplay',
      },
      ctx
    ).map((id) => ctx.view.cards[id]);

    const score =
      sum(playerScores) -
      sum(victoryCards.map((c) => c.props.victory)) +
      ctx.state.round * 10;

    ctx.state.result = {
      win: true,
      score,
    };
    return;
  }

  if (action === 'loose') {
    ctx.state.result = {
      win: false,
      score: 0,
    };
    return;
  }

  if (action === 'stackPop') {
    const effect = ctx.state.stack.pop();
    if (effect) {
      if ('whenRevealed' in effect && !effect.canceled) {
        ctx.state.next.unshift(effect.whenRevealed);
      }
      if ('shadow' in effect && !effect.canceled) {
        ctx.state.next.unshift(effect.shadow);
      }
    }
    return;
  }

  if (action === 'stateCheck') {
    const destroy = getTargetCards('destroyed', ctx);
    const explore = getTargetCards(
      { simple: 'explored', type: 'location' },
      ctx
    );
    const advance = getTargetCards({ simple: 'explored', type: 'quest' }, ctx);

    if (destroy.length > 0 || explore.length > 0 || advance.length > 0) {
      ctx.state.next.unshift('stateCheck');
    }

    if (destroy.length > 0) {
      ctx.state.next.unshift({
        card: destroy,
        action: 'destroy',
      });
    }

    if (explore.length > 0) {
      ctx.state.next.unshift({
        card: explore,
        action: 'explore',
      });
    }

    if (advance.length > 0) {
      ctx.state.next.unshift({
        card: advance,
        action: 'advance',
      });
    }

    for (const player of values(ctx.state.players)) {
      const heroes = getTargetCards(
        { simple: 'inAPlay', type: 'hero', controller: player.id },
        ctx
      );
      if (heroes.length === 0) {
        ctx.state.next.unshift({ player: player.id, action: 'eliminate' });
        return;
      }
    }

    return;
  }

  if (action === 'sendCommitedEvents') {
    const questers = getTargetCards({ mark: 'questing' }, ctx);
    if (questers.length > 0) {
      ctx.state.next.unshift(
        questers.map((id) => ({
          event: {
            type: 'commits',
            card: id,
          },
        }))
      );
    }
    return;
  }

  if (action === 'endScope') {
    ctx.state.scopes.pop();
    return;
  }

  if ('player' in action && 'action' in action) {
    const ids = getTargetPlayers(action.player, ctx);
    for (const id of ids) {
      const player = ctx.state.players[id];
      if (player) {
        if (action.scooped) {
          executePlayerAction(action.action, player, ctx);
        } else {
          ctx.state.next.unshift({
            useScope: { var: 'target', player: id },
            action: { player: id, action: action.action, scooped: true },
          });
        }
      } else {
        throw new Error('player not found');
      }
    }
    return;
  }

  if ('card' in action && 'action' in action) {
    const ids = getTargetCards(action.card, ctx);

    if (action.scooped) {
      const results = ids.map((id) => {
        const card = ctx.state.cards[id];
        if (card) {
          return executeCardAction(action.action, card, ctx);
        } else {
          throw new Error('player not found');
        }
      });
      return results.some((r) => r);
    } else {
      for (const id of ids) {
        const card = ctx.state.cards[id];
        if (card) {
          ctx.state.next.unshift({
            useScope: { var: 'target', card: id },
            action: { card: id, action: action.action, scooped: true },
          });
        } else {
          throw new Error('player not found');
        }
      }

      return;
    }
  }

  if ('useScope' in action) {
    const scope: Scope = {};
    executeScopeAction(action.useScope, scope, ctx);
    ctx.state.scopes.push(scope);
    ctx.state.next.unshift(action.action, 'endScope');
    return;
  }

  if (action.stackPush) {
    if (action.stackPush.type === 'whenRevealed') {
      const hasEffect = canExecute(action.stackPush.whenRevealed, false, ctx);
      if (!hasEffect) {
        return;
      }
    }

    if (action.stackPush.type === 'shadow') {
      const hasEffect = canExecute(action.stackPush.shadow, false, ctx);
      if (!hasEffect) {
        return;
      }
    }

    ctx.state.stack.push(action.stackPush);

    const responses = ctx.view.responses[action.stackPush.type] ?? [];

    const reponsesAction: Action =
      responses.length > 0
        ? [
            {
              player: 'first',
              action: {
                chooseActions: {
                  title: `Choose responses for: ${action.stackPush.description}`,
                  actions: responses.map((r) => ({
                    title: r.description,
                    action: {
                      useScope: [
                        {
                          var: 'target',
                          card: r.card,
                        },
                        {
                          var: 'self',
                          card: r.source,
                        },
                      ],
                      action: r.action,
                    },
                  })),
                  optional: true,
                  multi: true,
                },
              },
            },
          ]
        : [];

    ctx.state.next.unshift(reponsesAction);

    return;
  }

  if (action.cancel) {
    const effect = last(ctx.state.stack);
    if (!effect) {
      throw new Error('no effect to cancel');
    }

    if ('whenRevealed' in effect && action.cancel === 'when.revealed') {
      effect.canceled = true;
    }

    if ('shadow' in effect && action.cancel === 'shadow') {
      effect.canceled = true;
    }
    return;
  }

  if (action.addPlayer) {
    const playerId = !ctx.state.players[0]
      ? '0'
      : !ctx.state.players[1]
      ? '1'
      : ctx.state.players[2]
      ? '3'
      : '2';

    const player = createPlayerState(playerId);

    ctx.state.players[playerId] = player;

    for (const hero of action.addPlayer.heroes) {
      addPlayerCard(ctx.state, hero, playerId, 'front', 'playerArea');
    }

    for (const card of reverse(action.addPlayer.library)) {
      addPlayerCard(ctx.state, card, playerId, 'back', 'library');
    }

    player.thread = sum(
      action.addPlayer.heroes.map((h) => h.front.threatCost ?? 0)
    );

    return;
  }

  if (action.setupScenario) {
    for (const set of reverse(action.setupScenario.scenario.sets)) {
      for (const card of reverse(set.easy)) {
        addGameCard(ctx.state, card, 'back', 'encounterDeck');
      }

      if (action.setupScenario.difficulty === 'normal') {
        for (const card of reverse(set.normal)) {
          addGameCard(ctx.state, card, 'back', 'encounterDeck');
        }
      }
    }

    for (const questCard of reverse(action.setupScenario.scenario.quest)) {
      addGameCard(ctx.state, questCard, 'front', 'questDeck');
    }
    return;
  }

  if (action.beginPhase) {
    ctx.state.phase = action.beginPhase;
    return;
  }

  if (action.choice) {
    ctx.state.choice = action.choice as Choice;
    return;
  }

  if (action.playerActions) {
    ctx.state.next.unshift('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        title: action.playerActions,
        type: 'actions',
      },
    });
    return;
  }

  if (action.repeat) {
    const amount = calculateNumberExpr(action.repeat.amount, ctx);
    if (amount === 0) {
      return;
    } else {
      ctx.state.next = [
        action.repeat.action,
        {
          repeat: {
            amount: amount - 1,
            action: action.repeat.action,
          },
        },
        ...ctx.state.next,
      ];
    }
    return;
  }

  if (action.clearMarks) {
    for (const card of values(ctx.state.cards)) {
      card.mark[action.clearMarks] = false;
    }
    return;
  }

  if (action.placeProgress !== undefined) {
    if (action.placeProgress === 0) {
      return;
    }

    const activeLocation = getTargetCards({ top: 'activeLocation' }, ctx);

    if (activeLocation.length === 0) {
      ctx.state.next = [
        {
          card: { top: 'questArea' },
          action: { placeProgress: action.placeProgress },
        },
        ...ctx.state.next,
      ];
      return;
    }

    if (activeLocation.length === 1) {
      const id = activeLocation[0];
      const cardView = ctx.view.cards[id];
      const qp = cardView.props.questPoints;
      if (qp) {
        const cardState = ctx.state.cards[id];
        const remaining = qp - cardState.token.progress;
        const progressLocation = Math.min(action.placeProgress, remaining);
        const progressQuest = action.placeProgress - progressLocation;

        ctx.state.next.unshift(
          {
            card: activeLocation,
            action: { placeProgress: progressLocation },
          },
          {
            card: { top: 'questArea' },
            action: { placeProgress: progressQuest },
          }
        );
      }
    } else {
      throw new Error('multiple active locations');
    }
    return;
  }

  if (action.while) {
    const condition = calculateBoolExpr(action.while.condition, ctx);
    if (condition) {
      ctx.state.next.unshift(action.while.action, action);
    }
    return;
  }

  if (action.payment) {
    ctx.state.next.unshift(action.payment.cost, action.payment.effect);
    return;
  }

  if (action.useLimit) {
    const existing = ctx.state.actionLimits.find(
      (l) => l.card === action.useLimit?.card
    );

    if (!existing) {
      ctx.state.actionLimits.push({
        card: action.useLimit.card,
        amount: 1,
        type: action.useLimit.type,
      });
    } else {
      existing.amount += 1;
    }
    return;
  }

  if (action.event) {
    if (action.event === 'none') {
      ctx.state.event?.pop();
      return;
    }

    const event = action.event;

    if (!ctx.state.event) {
      ctx.state.event = [];
    }

    if (event.type === 'revealed') {
      ctx.state.choice = {
        id: ctx.state.nextId++,
        title: 'Revealed',
        type: 'show',
        cardId: event.card,
      };
    }

    ctx.state.event.push(action.event);

    ctx.state.next.unshift({ event: 'none' });

    const reponses = ctx.view.responses[event.type] ?? [];

    const forced = reponses
      .filter((r) => r.forced)
      .filter((r) => ('card' in event ? r.card === event.card : true))
      .filter(
        (r) =>
          !r.condition ||
          calculateBoolExpr(
            r.condition,
            updatedCtx(ctx, [
              { var: 'target', card: r.card },
              { var: 'self', card: r.source },
            ])
          )
      );

    const optional = reponses
      .filter((r) => !r.forced)
      .filter((r) => ('card' in event ? r.card === event.card : true))
      .filter(
        (r) =>
          !r.condition ||
          calculateBoolExpr(
            r.condition,
            updatedCtx(ctx, [
              { var: 'target', card: r.card },
              { var: 'self', card: r.source },
            ])
          )
      );

    if (optional.length > 0) {
      ctx.state.next.unshift({
        player: 'first',
        action: {
          chooseActions: {
            title: 'Choose responses for event ' + event.type,
            actions: optional.map((r) => ({
              title: r.description,
              action: {
                useScope: [
                  {
                    var: 'target',
                    card: r.card,
                  },
                  {
                    var: 'self',
                    card: r.source,
                  },
                ],
                action: r.action,
              },
            })),
            optional: true,
            multi: true,
          },
        },
      });
    }

    if (forced.length > 0) {
      ctx.state.next.unshift(
        ...forced.map((r) => ({
          useScope: [
            {
              var: 'target',
              card: r.card,
            },
            {
              var: 'self',
              card: r.source,
            },
          ],
          action: r.action,
        }))
      );
    }

    if (action.event.type === 'revealed') {
      const releaved =
        ctx.view.cards[action.event.card].rules.whenRevealed ?? [];
      if (releaved.length > 0) {
        const target = action.event.card;
        ctx.state.next.unshift(
          releaved.map((effect) => ({
            card: target,
            action: {
              whenRevealed: effect,
            },
          }))
        );
      }
    }

    // TODO surge
    return;
  }

  if (action.resolveAttack) {
    const attacking = getTargetCards(action.resolveAttack.attackers, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const defender = getTargetCards(action.resolveAttack.defender, ctx).map(
      (id) => ctx.view.cards[id]
    );

    const attack = sum(attacking.map((a) => a.props.attack || 0));
    const defense = sum(defender.map((d) => d.props.defense || 0));

    const damage = attack - defense;
    if (damage > 0) {
      if (defender.length === 1) {
        ctx.state.next.unshift({
          card: defender.map((c) => c.id),
          action: {
            dealDamage: {
              amount: damage,
              attackers: attacking.map((a) => a.id),
            },
          },
        });
      } else {
        throw new Error('unexpected defender count');
      }
    }
    return;
  }

  if (action.atEndOfPhase) {
    ctx.state.triggers.end_of_phase.push(action.atEndOfPhase);
    return;
  }

  if (action.if) {
    const result = calculateBoolExpr(action.if.condition, ctx);
    if (result && action.if.true) {
      ctx.state.next.unshift(action.if.true);
    }

    if (!result && action.if.false) {
      ctx.state.next.unshift(action.if.false);
    }
    return;
  }

  if (action.addCard) {
    const zone = getZoneState(action.addCard.zone, ctx.state);
    const owner =
      typeof action.addCard.zone !== 'string'
        ? action.addCard.zone.player
        : undefined;
    const cardId = ctx.state.nextId++;
    zone.cards.push(cardId);
    const cardState = createCardState(
      cardId,
      action.addCard.side,
      action.addCard.definition,
      owner,
      action.addCard.zone
    );
    ctx.state.cards[cardId] = cardState;

    // TODO simplify
    if (action.addCard.damage) {
      cardState.token.damage = action.addCard.damage;
    }

    if (action.addCard.progress) {
      cardState.token.progress = action.addCard.progress;
    }

    if (action.addCard.resources) {
      cardState.token.resources = action.addCard.resources;
    }

    if (action.addCard.exhausted) {
      cardState.tapped = true;
    }

    // TODO add modifiers

    // const modifiers = action.addCard.definition.front.abilities.flatMap((a) =>
    //   abilityToModifiers(id, a)
    // );

    // ctx.state.modifiers.push(...modifiers);

    if (action.addCard.attachments) {
      const ids: CardId[] = [];
      for (const atachDef of action.addCard.attachments) {
        const attachmenId = ctx.state.nextId++;
        ids.push(attachmenId);
        const attachmentState = createCardState(
          attachmenId,
          'front',
          atachDef,
          owner,
          action.addCard.zone
        );

        zone.cards.push(attachmenId);
        ctx.state.cards[attachmenId] = attachmentState;
        attachmentState.attachedTo = attachmenId;
      }

      cardState.attachments = ids;
    }

    return;
  }

  throw new Error(`unknown action: ${JSON.stringify(action)}`);
}
