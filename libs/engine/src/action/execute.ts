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
import { CardId, Token, values } from '@card-engine-nx/basic';
import { calculateBoolExpr } from '../expression/bool/calculate';
import { calculateNumberExpr } from '../expression/number/calculate';
import { updatedScopes } from '../context/update';
import { ExecutionContext } from '../context/execution';
import { canExecute } from './executable';
import { executeCardAction } from '../card/action/execute';
import { getTargetCards } from '../card/target/multi';
import { getTargetCard } from '../card/target/single';
import { executeScopeAction } from '../scope/execute';
import { gameRound } from '../round/gameRound';
import { getZoneState } from '../zone';

export function executeAction(
  action: Action,
  ctx: ExecutionContext,
  scopes: Scope[]
) {
  if (isArray(action)) {
    ctx.next(...action);
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
    ctx.next(
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

    ctx.next({ event: { type: 'end_of_round' } }, gameRound());
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

    ctx.next(...ctx.state.triggers.end_of_phase);
    ctx.state.triggers.end_of_phase = [];
    return;
  }

  if (action === 'chooseTravelDestination') {
    const existing = getTargetCards(
      { zoneType: 'activeLocation' },
      ctx,
      scopes
    );
    if (existing.length > 0) {
      return;
    }

    ctx.next({
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
    ctx.next({
      card: { type: 'enemy', zoneType: 'engaged' },
      action: 'dealShadowCard',
    });
    return;
  }

  if (action === 'passFirstPlayerToken') {
    const next = getTargetPlayer('next', ctx, scopes);
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
      ctx,
      scopes
    );

    const totalThreat = calculateNumberExpr('totalThreat', ctx, scopes);

    const diff = totalWillpower - totalThreat;
    if (diff > 0) {
      ctx.next({ placeProgress: diff });
    }
    if (diff < 0) {
      ctx.next({ player: 'each', action: { incrementThreat: -diff } });
    }
    return;
  }

  if (action === 'revealEncounterCard') {
    const card = getTargetCard({ top: 'encounterDeck' }, ctx, scopes);

    if (!card) {
      if (ctx.state.zones.discardPile.cards.length > 0) {
        ctx.next(
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

    ctx.next({
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
        ctx,
        scopes
      ).map((id) => ctx.state.cards[id]);

      const aliveHeroes = getTargetCards(
        {
          zone: { player: p.id, type: 'discardPile' },
          type: 'hero',
        },
        ctx,
        scopes
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
      ctx,
      scopes
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
        ctx.next(effect.whenRevealed);
      }
      if ('shadow' in effect && !effect.canceled) {
        ctx.next(effect.shadow);
      }
    }
    return;
  }

  if (action === 'stateCheck') {
    const destroy = getTargetCards('destroyed', ctx, scopes);
    const explore = getTargetCards(
      { simple: 'explored', type: 'location' },
      ctx,
      scopes
    );
    const advance = getTargetCards(
      { simple: 'explored', type: 'quest' },
      ctx,
      scopes
    );

    if (destroy.length > 0 || explore.length > 0 || advance.length > 0) {
      ctx.next('stateCheck');
    }

    if (destroy.length > 0) {
      ctx.next({
        card: destroy,
        action: 'destroy',
      });
    }

    if (explore.length > 0) {
      ctx.next({
        card: explore,
        action: 'explore',
      });
    }

    if (advance.length > 0) {
      ctx.next({
        card: advance,
        action: 'advance',
      });
    }

    for (const player of values(ctx.state.players)) {
      const heroes = getTargetCards(
        { simple: 'inAPlay', type: 'hero', controller: player.id },
        ctx,
        scopes
      );
      if (heroes.length === 0) {
        ctx.next({ player: player.id, action: 'eliminate' });
        return;
      }
    }

    return;
  }

  if (action === 'sendCommitedEvents') {
    const questers = getTargetCards({ mark: 'questing' }, ctx, scopes);
    if (questers.length > 0) {
      ctx.next(
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

  if (action === 'surge++') {
    ctx.state.surge++;
    return;
  }

  if (action === 'surge--') {
    ctx.state.surge--;
    return;
  }

  if ('player' in action && 'action' in action) {
    const ids = getTargetPlayers(action.player, ctx, scopes);
    for (const id of ids) {
      const player = ctx.state.players[id];
      if (player) {
        if (action.scooped) {
          executePlayerAction(action.action, player, ctx, scopes);
        } else {
          ctx.next({
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
    const ids = getTargetCards(action.card, ctx, scopes);

    if (action.scooped) {
      for (const id of ids) {
        const card = ctx.state.cards[id];
        if (card) {
          executeCardAction(action.action, card, ctx, scopes);
        } else {
          throw new Error('card not found');
        }
      }
      return;
    } else {
      for (const id of ids) {
        const card = ctx.state.cards[id];
        if (card) {
          ctx.next({
            useScope: { var: 'target', card: id },
            action: { card: id, action: action.action, scooped: true },
          });
        } else {
          throw new Error('card not found');
        }
      }

      return;
    }
  }

  if ('useScope' in action) {
    const scope: Scope = {};
    executeScopeAction(action.useScope, scope, ctx, scopes);
    ctx.state.scopes.push(scope);
    ctx.next(action.action, 'endScope');
    return;
  }

  if (action.stackPush) {
    if (action.stackPush.type === 'whenRevealed') {
      const hasEffect = canExecute(
        action.stackPush.whenRevealed,
        false,
        ctx,
        scopes
      );
      if (!hasEffect) {
        return;
      }
    }

    if (action.stackPush.type === 'shadow') {
      const hasEffect = canExecute(action.stackPush.shadow, false, ctx, scopes);
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

    ctx.next(reponsesAction);

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

    ctx.state.players[playerId] = createPlayerState(playerId);

    for (const card of action.addPlayer.library) {
      ctx.next({
        addCard: {
          definition: card,
          side: 'back',
          zone: { player: playerId, type: 'library' },
        },
      });
    }

    for (const hero of reverse(action.addPlayer.heroes)) {
      ctx.next({
        addCard: {
          definition: hero,
          side: 'front',
          zone: { player: playerId, type: 'playerArea' },
        },
      });
    }

    const player = ctx.state.players[playerId];

    if (player) {
      player.thread = sum(
        action.addPlayer.heroes.map((h) => h.front.threatCost ?? 0)
      );
    }

    return;
  }

  if (action.setupScenario) {
    for (const questCard of action.setupScenario.scenario.quest) {
      ctx.next({
        addCard: {
          definition: questCard,
          side: 'front',
          zone: 'questDeck',
        },
      });
    }

    for (const set of action.setupScenario.scenario.sets) {
      if (action.setupScenario.difficulty === 'normal') {
        for (const card of set.normal) {
          ctx.next({
            addCard: {
              definition: card,
              side: 'back',
              zone: 'encounterDeck',
            },
          });
        }
      }

      for (const card of set.easy) {
        ctx.next({
          addCard: {
            definition: card,
            side: 'back',
            zone: 'encounterDeck',
          },
        });
      }
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
    ctx.next('stateCheck', {
      choice: {
        id: ctx.state.nextId++,
        title: action.playerActions,
        type: 'actions',
      },
    });
    return;
  }

  if (action.repeat) {
    const amount = calculateNumberExpr(action.repeat.amount, ctx, scopes);
    if (amount === 0) {
      return;
    } else {
      ctx.next(action.repeat.action, {
        repeat: {
          amount: amount - 1,
          action: action.repeat.action,
        },
      });
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

    const activeLocation = getTargetCards(
      { top: 'activeLocation' },
      ctx,
      scopes
    );

    if (activeLocation.length === 0) {
      ctx.next({
        card: { top: 'questArea' },
        action: { placeProgress: action.placeProgress },
      });
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

        ctx.next(
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
    const condition = calculateBoolExpr(action.while.condition, ctx, scopes);
    if (condition) {
      ctx.next(action.while.action, action);
    }
    return;
  }

  if (action.payment) {
    ctx.next(action.payment.cost, action.payment.effect);
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

    ctx.next({ event: 'none' });

    const reponses = ctx.view.responses[event.type] ?? [];

    const forced = reponses
      .filter((r) => r.forced)
      .filter((r) => ('card' in event ? r.card === event.card : true))
      .filter(
        (r) =>
          !r.condition ||
          calculateBoolExpr(
            r.condition,
            ctx,
            updatedScopes(ctx, scopes, [
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
            ctx,
            updatedScopes(ctx, scopes, [
              { var: 'target', card: r.card },
              { var: 'self', card: r.source },
            ])
          )
      );

    if (optional.length > 0) {
      ctx.next({
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
      ctx.next(
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
      if (ctx.view.cards[action.event.card].props.keywords?.surge) {
        ctx.next('surge++');
      }

      const whenRevealed =
        ctx.view.cards[action.event.card].rules.whenRevealed ?? [];
      if (whenRevealed.length > 0) {
        const target = action.event.card;
        ctx.next(
          whenRevealed.map((effect) => ({
            card: target,
            action: {
              whenRevealed: effect,
            },
          }))
        );
      }
    }

    return;
  }

  if (action.resolveAttack) {
    const attacking = getTargetCards(
      action.resolveAttack.attackers,
      ctx,
      scopes
    ).map((id) => ctx.view.cards[id]);

    const defender = getTargetCards(
      action.resolveAttack.defender,
      ctx,
      scopes
    ).map((id) => ctx.view.cards[id]);

    const attack = sum(attacking.map((a) => a.props.attack || 0));
    const defense = sum(defender.map((d) => d.props.defense || 0));

    const damage = attack - defense;
    if (damage > 0) {
      if (defender.length === 1) {
        ctx.next({
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
    const result = calculateBoolExpr(action.if.condition, ctx, scopes);
    if (result && action.if.true) {
      ctx.next(action.if.true);
    }

    if (!result && action.if.false) {
      ctx.next(action.if.false);
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
      typeof action.addCard.zone !== 'string' &&
        action.addCard.zone.type !== 'engaged'
        ? owner
        : undefined,
      action.addCard.zone
    );

    const tokens: Token[] = ['damage', 'progress', 'resources'];

    for (const token of tokens) {
      if (action.addCard[token]) {
        const amount = action.addCard[token];
        if (amount) {
          cardState.token[token] = amount;
        }
      }
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

    ctx.state.cards[cardId] = cardState;

    return;
  }

  throw new Error(`unknown action: ${JSON.stringify(action)}`);
}
