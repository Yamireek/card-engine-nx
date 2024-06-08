import { cloneDeep, intersection, isArray, last } from 'lodash';
import { action, computed, isObservable, makeObservable, toJS } from 'mobx';
import { CardId, asArray, keys, zonesEqual } from '@card-engine-nx/basic';
import {
  Action,
  CardAction,
  CardBoolExpr,
  CardNumberExpr,
  CardProps,
  CardRules,
  CardTarget,
  isInPlay,
  mergeCardRules,
} from '@card-engine-nx/state';
import { uiEvent } from '../events';
import { ZoneCtx, BaseCtx } from './internal';
import { createPayCostAction, getCardFromScope, getZoneType } from './utils';

export class CardCtx {
  constructor(
    public game: BaseCtx,
    public readonly id: CardId,
    observable: boolean
  ) {
    if (observable) {
      makeObservable(this, {
        state: computed({ keepAlive: true }),
        props: computed({ keepAlive: true }),
        modifiers: computed({ keepAlive: true }),
        rules: computed({ keepAlive: true }),
        execute: action,
      });
    }
  }

  get state() {
    const state = this.game.state.cards[this.id];
    if (!state) {
      throw new Error('not found');
    }
    return state;
  }

  get token() {
    return this.state.token;
  }

  get props(): CardProps {
    if (this.state.sideUp === 'shadow') {
      return {};
    }

    const modifiers = this.game.modifiers.cards[this.id];
    const printed = this.state.definition[this.state.sideUp];

    if (!modifiers || modifiers.length === 0) {
      return printed;
    }

    const draft = isObservable(printed) ? toJS(printed) : cloneDeep(printed);

    for (const modifier of modifiers) {
      if ('increment' in modifier) {
        const prev = draft[modifier.property];
        if (prev !== undefined) {
          draft[modifier.property] = prev + modifier.increment;
        }
      }

      if ('rule' in modifier) {
        draft.rules = mergeCardRules(draft.rules, modifier.rule);
      }
    }

    return draft;
  }

  get modifiers() {
    return this.game.modifiers.cards[this.id];
  }

  get rules(): CardRules {
    return this.props.rules || {};
  }

  get zone(): ZoneCtx {
    return this.game.getZone(this.state.zone);
  }

  getBool(expr: CardBoolExpr): boolean {
    if (typeof expr === 'boolean') {
      return expr;
    }

    if (expr === 'in_a_play') {
      return this.zone.inPlay;
    }

    if (expr.hasTrait) {
      return this.props.traits && this.props.traits.includes(expr.hasTrait)
        ? true
        : false;
    }

    if (expr.hasMark) {
      return this.state.mark[expr.hasMark];
    }

    if (expr.is) {
      return this.is(expr.is);
    }

    if (expr.isType) {
      const type = this.props.type;
      if (expr.isType === 'character' && (type === 'ally' || type === 'hero')) {
        return true;
      } else {
        return expr.isType === type;
      }
    }

    if (expr.name) {
      return this.props.name === expr.name;
    }

    if (expr.zone) {
      return this.zone.type === expr.zone;
    }

    if (expr.and) {
      return expr.and.every((e) => this.getBool(e));
    }

    if (expr.global) {
      return this.game.getBool(expr.global);
    }

    if (expr.predicate) {
      // TODO merge with is
      return this.is(expr.predicate);
    }

    throw new Error(`unknown card bool expression: ${JSON.stringify(expr)}`);
  }

  getNumber(expr: CardNumberExpr) {
    if (typeof expr === 'number') {
      return expr;
    }

    if (expr === 'threadCost') {
      return this.props.threatCost || 0;
    }

    if (expr === 'willpower') {
      return this.props.willpower || 0;
    }

    if (expr === 'threat') {
      return this.props.threat || 0;
    }

    if (expr === 'sequence') {
      return this.props.sequence || 0;
    }

    if (expr === 'cost') {
      const cost = this.props.cost;
      return typeof cost === 'number' ? cost : 0;
    }

    if (expr.tokens) {
      return this.token[expr.tokens];
    }

    throw new Error('uknown CardNumberExpr:' + JSON.stringify(expr));
  }

  canExecute(action: CardAction): boolean {
    if (isArray(action)) {
      const values = action.map((a) => this.canExecute(a));
      return values.every((v) => v);
    }

    const zone = getZoneType(this.state.zone);
    const inPlay = isInPlay(zone);

    if (typeof action === 'string') {
      if (action === 'moveToBottom' || action === 'moveToTop') {
        return true;
      }

      if (inPlay && action === 'travel') {
        if (this.game.state.zones.activeLocation.cards.length > 0) {
          return false;
        }

        const expr = this.rules.conditional?.travel ?? [];
        if (expr.length > 0) {
          return this.game.getBool({ and: expr });
        }

        return true;
      }

      if (inPlay && action === 'exhaust') {
        return !this.state.tapped && zone === 'playerArea';
      }

      if (inPlay && action === 'ready') {
        return this.state.tapped;
      }

      if (zone === 'hand' && action === 'discard') {
        return true;
      }

      if (zone === 'playerArea' && action === 'discard') {
        return true;
      }

      if (zone === 'encounterDeck' && action === 'discard') {
        return true;
      }

      if (zone === 'encounterDeck' && action === 'reveal') {
        return true;
      }

      if (zone === 'library' && action === 'draw') {
        if (!this.state.owner) {
          return false;
        }

        const owner = this.game.getPlayer(this.state.owner);
        return zone === 'library' && !owner.rules.disableDraw;
      }

      if (zone === 'playerArea' && action === 'commitToQuest') {
        return !this.state.tapped;
      }

      return false;
    }

    if (zone === 'playerArea' && action.declareAsDefender) {
      return !this.state.tapped;
    }

    if (zone === 'playerArea' && action.payResources) {
      const amount = this.game.getNumber(action.payResources);
      return this.token.resources >= amount;
    }

    if (zone === 'engaged' && action.resolveEnemyAttacking) {
      return true;
    }

    if (action.mark) {
      return true;
    }

    if (action.clear) {
      return true;
    }

    if (inPlay && action.dealDamage) {
      return true;
    }

    if (
      zone === 'encounterDeck' &&
      this.state.sideUp === 'front' &&
      action.dealDamage
    ) {
      return true;
    }

    if (zone === 'playerArea' && action.heal) {
      return this.state.token.damage > 0;
    }

    if (action.move) {
      const zone = this.game.getZone(action.move.to);
      if (!zone.inPlay) {
        return true;
      }

      const unique = this.props.unique;
      if (!unique) {
        return true;
      }

      const exising = this.game.getCards({
        simple: 'inAPlay',
        name: this.props.name ?? '',
      });

      return exising.length === 0;
    }

    if (inPlay && action.attachCard) {
      const target = this.game.getCard(action.attachCard);
      if (!target.props.unique) {
        return true;
      }

      const exising = this.game.getCards({
        simple: 'inAPlay',
        name: target.props.name ?? '',
      });

      return exising.length === 0;
    }

    if (inPlay && action.modify) {
      return true;
    }

    if (inPlay && action.generateResources) {
      return true;
    }

    if (
      zone === 'engaged' ||
      (zone === 'stagingArea' && action.resolvePlayerAttacking)
    ) {
      return true;
    }

    if (zone === 'hand' && action.payCost) {
      if (!this.state.controller) {
        return false;
      }

      const payCostAction = createPayCostAction(this, action.payCost);

      if (!payCostAction) {
        return true;
      }

      const controller = this.game.players[this.state.controller];
      return controller?.canExecute(payCostAction) ?? false;
    }

    if (zone === 'stagingArea' && action.engagePlayer) {
      return true;
    }

    if (action.engagePlayer) {
      if (this.state.zone === 'stagingArea') {
        return true;
      }

      if (typeof this.state.zone === 'string') {
        return false;
      }

      const player = this.game.getPlayer(action.engagePlayer);
      return this.state.zone.player !== player.id;
    }

    if (action.placeProgress) {
      return inPlay;
    }

    if (action.putInPlay) {
      if (inPlay) {
        return false;
      }

      if (!this.props.unique) {
        return true;
      }

      const exising = this.game.getCards({
        simple: 'inAPlay',
        name: this.props.name ?? '',
      });

      return exising.length === 0;
    }

    if (action.flip) {
      return true;
    }

    if (action.controller && this.state.controller) {
      const controller = this.game.getPlayer(this.state.controller);
      return controller.canExecute(action.controller);
    }

    if (action.setController) {
      return inPlay;
    }

    if (action.action) {
      return this.game.canExecute(action.action, false);
    }

    return false;
  }

  execute(action: CardAction) {
    if (isArray(action)) {
      const actions: Action[] = action.map((a) => ({
        card: this.id,
        action: a,
      }));

      this.game.next(...actions);
      return;
    }

    if (action === 'empty') {
      return;
    }

    if (action === 'ready') {
      this.state.tapped = false;
      this.game.logger.log(`${this.props.name} is ready`);
      return;
    }

    if (action === 'travel') {
      const travelCost = this.rules.travel ?? [];
      this.game.next(
        ...travelCost,
        {
          card: this.id,
          action: {
            move: {
              from: 'stagingArea',
              to: 'activeLocation',
            },
          },
        },
        { event: { type: 'traveled', card: this.id } }
      );
      this.game.logger.log(`Traveling to ${this.props.name}`);
      return;
    }

    if (action === 'exhaust') {
      this.state.tapped = true;
      this.game.logger.log(`${this.props.name} exhausted`);
      return;
    }

    if (action === 'reveal') {
      if (this.state.sideUp === 'back') {
        this.game.next({
          card: this.id,
          action: [{ flip: 'front' }, 'reveal'],
        });
        return;
      }

      this.game.next(
        { event: { type: 'revealed', card: this.id } },
        {
          card: this.id,
          action: {
            move: {
              from: 'encounterDeck',
              to:
                this.props.type === 'treachery' ? 'discardPile' : 'stagingArea',
            },
          },
        },
        {
          if: {
            condition: {
              more: ['surge', 0],
            },
            true: ['surge--', 'revealEncounterCard'],
          },
        }
      );

      return;
    }

    if (action === 'shuffleToDeck') {
      if (this.state.owner) {
        this.game.next(
          {
            card: this.id,
            action: {
              move: {
                to: {
                  player: this.state.owner,
                  type: 'library',
                },
                side: 'back',
              },
            },
          },
          {
            player: this.state.owner,
            action: 'shuffleLibrary',
          }
        );
      }

      return;
    }

    if (action === 'discard') {
      const owner = this.state.owner;

      this.game.next({
        card: this.id,
        action: {
          move: {
            to: !owner ? 'discardPile' : { type: 'discardPile', player: owner },
            side: 'front',
          },
        },
      });
      return;
    }

    if (action === 'advance') {
      this.token.progress = 0;

      const removedExplored: Action = {
        card: this.id,
        action: {
          move: {
            from: 'questArea',
            to: 'removed',
          },
        },
      };

      const nexts = this.game.getCards({
        zone: 'questDeck',
        sequence: {
          plus: [{ card: { target: this.id, value: 'sequence' } }, 1],
        },
      });

      if (nexts.length === 0) {
        this.game.next('win');
        return;
      }

      const next = nexts.length === 1 ? nexts[0] : this.game.random.item(nexts);

      this.game.next(
        removedExplored,
        {
          choice: {
            id: this.game.state.nextId++,
            type: 'show',
            title: 'Next quest card',
            cardId: next.id,
          },
        },
        {
          card: next.id,
          action: [
            {
              move: {
                from: 'questDeck',
                to: 'questArea',
                side: 'front',
              },
            },
            { flip: 'back' },
          ],
        },
        {
          event: {
            type: 'revealed',
            card: next.id,
          },
        }
      );

      return;
    }

    if (action === 'draw') {
      const owner = this.state.owner;

      if (!owner) {
        throw new Error("can't draw card without owner");
      }

      if (this.game.getPlayer(owner).rules.disableDraw) {
        return;
      }

      this.game.next({
        card: this.id,
        action: {
          move: {
            to: { type: 'hand', player: owner },
            side: 'front',
          },
        },
      });
      return;
    }

    if (action === 'explore') {
      this.game.next(
        {
          event: {
            type: 'explored',
            card: this.id,
          },
        },
        {
          card: this.id,
          action: {
            move: {
              to: 'discardPile',
            },
          },
        }
      );
      return;
    }

    if (action === 'commitToQuest') {
      this.game.next({
        card: this.id,
        action: ['exhaust', { mark: 'questing' }],
      });
      return;
    }

    if (action === 'resolveShadowEffects') {
      const cards = this.game.getCards({ shadows: this.id });

      if (cards.length > 0) {
        this.game.next(
          {
            card: cards.map((s) => s.id),
            action: {
              flip: 'shadow',
            },
          },
          {
            card: cards.map((s) => s.id),
            action: 'resolveShadow',
          }
        );
      }

      return;
    }

    if (action === 'resolveShadow') {
      const shadows = this.rules.shadows ?? [];

      if (shadows.length > 0) {
        for (const shadow of shadows) {
          this.game.next(
            {
              choice: {
                title: 'Shadow effect',
                id: this.game.state.nextId++,
                type: 'show',
                cardId: this.id,
              },
            },
            {
              stackPush: {
                type: 'shadow',
                description: shadow.description,
                shadow: {
                  useScope: {
                    var: 'self',
                    card: this.id,
                  },
                  action: shadow.action,
                },
              },
            },
            'stackPop'
          );
        }
      }
      return;
    }

    if (action === 'moveToBottom') {
      const zone = this.game.getZone(this.state.zone);
      zone.state.cards = [
        this.id,
        ...zone.state.cards.filter((id) => id !== this.id),
      ];
      return;
    }

    if (action === 'moveToTop') {
      const zone = this.game.getZone(this.state.zone);
      zone.state.cards = [
        ...zone.state.cards.filter((id) => id !== this.id),
        this.id,
      ];
      return;
    }

    if (action === 'dealShadowCard') {
      const cardId = this.id;
      const deck = this.game.state.zones.encounterDeck;
      const shadow = deck.cards.pop();
      if (shadow) {
        const targetZone = this.game.getZone(
          this.game.state.cards[cardId].zone
        );
        this.game.state.cards[cardId].shadows.push(shadow);
        this.game.state.cards[shadow].zone = this.game.state.cards[cardId].zone;
        this.game.state.cards[shadow].shadowOf = cardId;
        targetZone.state.cards.push(shadow);
      }
      return;
    }

    if (action === 'destroy' || action.destroy) {
      const owner = this.state.owner;

      this.game.next(
        {
          card: this.id,
          action: {
            move: {
              to: !owner
                ? 'discardPile'
                : { type: 'discardPile', player: owner },
            },
          },
        },
        {
          event: {
            type: 'destroyed',
            card: this.id,
            attackers:
              action === 'destroy' ? [] : action.destroy?.attackers ?? [],
          },
        }
      );

      return;
    }

    if (action.whenRevealed) {
      this.game.next(
        {
          stackPush: {
            type: 'whenRevealed',
            description: action.whenRevealed.description,
            whenRevealed: {
              useScope: {
                var: 'self',
                card: this.id,
              },
              action: action.whenRevealed.action,
            },
          },
        },
        'stackPop'
      );
      return;
    }

    if (action.payCost) {
      const controller = this.state.controller;
      if (!controller) {
        return;
      }
      const payCostAction = createPayCostAction(this, action.payCost);
      if (payCostAction) {
        this.game.next({
          player: controller,
          action: payCostAction,
        });
      }
      return;
    }

    if (action.ready === 'refresh') {
      const cost = this.rules.refreshCost ?? [];
      const free = cost.length === 0;
      if (free) {
        this.game.next({ card: this.id, action: 'ready' });
      } else {
        if (this.state.controller) {
          this.game.next({
            player: this.state.controller,
            action: {
              chooseActions: {
                title: 'Pay for refresh?',
                actions: [
                  {
                    title: 'Yes',
                    action: {
                      card: this.id,
                      action: [...cost, 'ready'],
                    },
                  },
                ],
                optional: true,
              },
            },
          });
        }
      }

      return;
    }

    if (action.declareAsDefender) {
      this.state.tapped = true;
      this.state.mark.defending = true;
      this.game.next({
        event: {
          type: 'declaredAsDefender',
          card: this.id,
          attacker: action.declareAsDefender.attacker,
        },
      });
      return;
    }

    if (action.engagePlayer) {
      const player = this.game.getPlayer(action.engagePlayer);
      this.game.next(
        {
          card: this.id,
          action: {
            move: {
              from: 'stagingArea',
              to: { player: player.id, type: 'engaged' },
            },
          },
        },
        {
          event: {
            type: 'engaged',
            card: this.id,
            player: player.id,
          },
        }
      );
      return;
    }

    if (action.heal) {
      this.game.logger.success(
        `Healed ${action.heal} damage on ${this.props.name}`
      );
      if (action.heal === 'all') {
        this.state.token.damage = 0;
      } else {
        this.state.token.damage = Math.max(
          0,
          this.state.token.damage - action.heal
        );
      }

      return;
    }

    if (action.dealDamage) {
      const data =
        typeof action.dealDamage === 'number'
          ? { amount: action.dealDamage, attackers: [] }
          : action.dealDamage;

      const amount = this.game.getNumber(data.amount);

      this.state.token.damage += amount;

      if (this.props.type === 'enemy') {
        this.game.logger.success(
          `Enemy ${this.props.name} was dealt ${amount} damage`
        );
      } else {
        this.game.logger.warning(
          `Character ${this.props.name} was dealt ${amount} damage`
        );
      }

      const hitpoints = this.props.hitPoints;

      if (hitpoints && this.token.damage >= hitpoints) {
        this.execute({
          destroy: {
            attackers: data.attackers ?? [],
          },
        });
      }

      this.game.next({
        event: {
          type: 'receivedDamage',
          card: this.id,
          damage: amount,
        },
      });

      return;
    }

    if (action.flip) {
      this.state.sideUp = action.flip;
      return;
    }

    if (action.generateResources !== undefined) {
      const amount = this.game.getNumber(action.generateResources);
      if (amount > 0) {
        this.state.token.resources += amount;
        this.game.logger.success(
          `${this.props.name} generated ${amount} resources`
        );
      }
      return;
    }

    if (action.payResources !== undefined) {
      const amount = this.game.getNumber(action.payResources);
      this.state.token.resources -= amount;
      return;
    }

    if (action.move) {
      const from = action.move.from
        ? this.game.getZone(action.move.from)
        : this.zone;

      if (action.move.from) {
        if (!zonesEqual(this.state.zone, from.id)) {
          return;
        }
      }

      const to = this.game.getZone(action.move.to);

      from.state.cards = from.state.cards.filter((c) => c !== this.id);
      to.state.cards.push(this.id);
      this.state.sideUp = action.move.side ?? this.state.sideUp;
      this.state.zone = to.id;

      this.game.events.send(
        uiEvent.card_moved({
          cardId: this.id,
          source: from.id,
          destination: to.id,
          side: action.move.side ?? this.state.sideUp,
        })
      );

      if (!from.inPlay && to.inPlay) {
        this.game.next({ event: { type: 'enteredPlay', card: this.id } });
      }

      if (from.inPlay && !to.inPlay) {
        this.state.tapped = false;
        this.state.mark = {};
        this.state.token = {
          damage: 0,
          progress: 0,
          resources: 0,
        };

        this.game.next({
          card: this.state.attachments,
          action: 'discard',
        });

        this.game.next({
          card: this.state.shadows,
          action: 'discard',
        });

        this.game.state.modifiers = this.game.state.modifiers.filter(
          (m) => m.source !== this.id
        );

        if (this.state.attachedTo) {
          const parent = this.game.state.cards[this.state.attachedTo];
          if (parent) {
            parent.attachments = parent.attachments.filter(
              (a) => a !== this.id
            );
          }
          this.state.attachedTo = undefined;
        }

        if (this.state.shadowOf) {
          const parent = this.game.state.cards[this.state.shadowOf];
          if (parent) {
            parent.shadows = parent.shadows.filter((a) => a !== this.id);
          }
          this.state.shadowOf = undefined;
        }

        this.game.next({ event: { type: 'leftPlay', card: this.id } });
      }

      return;
    }

    if (action.placeProgress !== undefined) {
      if (action.placeProgress === 0) {
        return;
      }

      this.token.progress += action.placeProgress;
      if (this.props.type === 'quest') {
        const qp = this.props.questPoints;
        if (qp && this.token.progress >= qp) {
          const expr = this.rules.conditional?.advance ?? [];
          const allowed =
            expr.length > 0 ? this.game.getBool({ and: expr }) : true;

          if (allowed) {
            this.execute('advance');
          }
        }
      }

      this.game.logger.success(
        `Placing ${action.placeProgress} progress to ${this.props.name}`
      );

      if (this.props.type === 'location') {
        const qp = this.props.questPoints;
        if (qp && this.token.progress >= qp) {
          this.execute('explore');
        }
      }

      return;
    }

    if (action.resolveEnemyAttacking) {
      this.game.next(
        {
          card: this.id,
          action: { mark: 'attacking' },
        },
        {
          event: {
            type: 'attacks',
            card: this.id,
          },
        },
        { playerActions: 'Declare defender' },
        {
          player: action.resolveEnemyAttacking,
          action: 'declareDefender',
        },
        {
          card: this.id,
          action: 'resolveShadowEffects',
        },
        {
          player: action.resolveEnemyAttacking,
          action: 'determineCombatDamage',
        },
        { clearMarks: 'attacking' },
        { clearMarks: 'defending' },
        {
          card: this.id,
          action: { mark: 'attacked' },
        }
      );
      return;
    }

    if (action.resolvePlayerAttacking) {
      const enemy = this.id;
      this.game.next(
        { card: enemy, action: { mark: 'defending' } },
        { playerActions: 'Declare attackers' },
        {
          player: action.resolvePlayerAttacking,
          action: {
            declareAttackers: enemy,
          },
        },
        { playerActions: 'Determine combat damage' },
        {
          player: action.resolvePlayerAttacking,
          action: 'determineCombatDamage',
        },
        { clearMarks: 'attacking' },
        { clearMarks: 'defending' },
        { card: enemy, action: { mark: 'attacked' } }
      );
      return;
    }

    if (action.mark) {
      this.state.mark[action.mark] = true;
      return;
    }

    if (action.attachCard) {
      const target = this.game.getCard(action.attachCard);
      if (target) {
        target.state.attachments.push(target.id);
        target.state.attachedTo = this.id;
        this.game.next({
          card: target.id,
          action: {
            move: {
              side: 'front',
              to: this.state.zone,
            },
          },
        });
      }
      return;
    }

    if (action.modify) {
      const source = this.game.getCard({ var: 'self' });
      if (isArray(action.modify)) {
        for (const modifier of action.modify) {
          this.game.state.modifiers.push({
            source: source.id,
            card: this.id,
            modifier,
            until: action.until,
          });
        }
      } else {
        this.game.state.modifiers.push({
          source: source.id,
          card: this.id,
          modifier: action.modify,
          until: action.until,
        });
      }
      return;
    }

    if (action.clear) {
      this.state.mark[action.clear] = false;
      return;
    }

    if (action.putInPlay) {
      const player = this.game.getPlayer(action.putInPlay);
      this.game.next({
        card: this.id,
        action: {
          move: {
            to: { player: player.id, type: 'playerArea' },
            side: 'front',
          },
        },
      });
      return;
    }

    if (action.controller && this.state.controller) {
      const controller = this.state.controller;
      this.game.next({
        player: controller,
        action: action.controller,
      });
      return;
    }

    if (action.setController) {
      const controller = this.game.getPlayer(action.setController);
      this.state.controller = controller.id;
      return;
    }

    if (action.action) {
      this.game.execute(action.action);
      return;
    }

    throw new Error('uknown CardAction: ' + JSON.stringify(action));
  }

  is(target: CardTarget): boolean {
    if (typeof target === 'number') {
      return this.id === target;
    }

    if (isArray(target)) {
      return target.includes(this.id);
    }

    if (typeof target !== 'string' && Object.keys(target).length > 1) {
      return keys(target).every((key) => this.is({ [key]: target[key] }));
    }

    if (target === 'self' || target === 'target') {
      const ids = getCardFromScope(this.game.scopes, target);
      return (ids && ids?.includes(this.id)) ?? false;
    }

    if (target === 'each') {
      return true;
    }

    if (target === 'inAPlay') {
      return isInPlay(getZoneType(this.state.zone));
    }

    if (target === 'character') {
      return this.props.type === 'ally' || this.props.type === 'hero';
    }

    if (target === 'ready') {
      return !this.state.tapped;
    }

    if (target === 'event') {
      const event = last(this.game.state.event);
      if (event && 'card' in event) {
        return event.card === this.id;
      } else {
        return false;
      }
    }

    if (target === 'exhausted') {
      return this.state.tapped;
    }

    if (target === 'destroyed') {
      const hitpoints = this.props.hitPoints;
      return hitpoints !== undefined && hitpoints <= this.state.token.damage;
    }

    if (target === 'explored') {
      const need = this.props.questPoints;
      const expr = this.rules.conditional?.advance ?? [];
      const allowed = expr.length > 0 ? this.game.getBool({ and: expr }) : true;
      return need !== undefined && allowed && need <= this.state.token.progress;
    }

    if (target === 'isAttached') {
      return !!this.state.attachedTo;
    }

    if (target === 'isShadow') {
      return !!this.state.shadowOf;
    }

    if (target.simple) {
      return asArray(target.simple).every((s) => this.is(s));
    }

    if (target.and) {
      return target.and.every((p) => this.is(p));
    }

    if (target.not) {
      return !this.is(target.not);
    }

    if (target.owner) {
      if (!this.state.owner) {
        return false;
      }

      const players = this.game.getPlayers(target.owner).map((p) => p.id);
      return players.includes(this.state.owner);
    }

    if (target.type) {
      return this.props.type
        ? asArray(target.type).includes(this.props.type)
        : false;
    }

    if (target.sequence) {
      const value = this.game.getNumber(target.sequence);
      return value === this.props.sequence;
    }

    if (target.sphere) {
      if (target.sphere === 'any') {
        return (
          this.props.sphere !== undefined &&
          this.props.sphere.length > 0 &&
          !this.props.sphere.includes('neutral')
        );
      }

      const spheres = asArray(target.sphere);

      return this.props.sphere?.some((s) => spheres.includes(s)) ?? false;
    }

    if (target.controller) {
      if (!this.state.controller) {
        return false;
      }

      const players = this.game.getPlayers(target.controller).map((p) => p.id);
      return players.includes(this.state.controller);
    }

    if (target.mark) {
      return this.state.mark[target.mark];
    }

    if (target.trait) {
      return this.props.traits?.includes(target.trait) ?? false;
    }

    if (target.zone) {
      return zonesEqual(target.zone, this.state.zone);
    }

    if (target.zoneType) {
      const type = getZoneType(this.state.zone);
      return target.zoneType.includes(type);
    }

    if (target.hasAttachment) {
      const attachments = this.game
        .getCards(target.hasAttachment)
        .map((a) => a.id);
      return intersection(attachments, this.state.attachments).length > 0;
    }

    if (target.shadows) {
      if (!this.state.shadowOf) {
        return false;
      }

      const targets = this.game.getCards(target.shadows).map((c) => c.id);
      return targets.includes(this.state.shadowOf);
    }

    if (target.keyword) {
      return (
        (this.props.keywords && this.props.keywords[target.keyword]) ?? false
      );
    }

    if (target.name) {
      return (
        this.state.definition.front.name === target.name ||
        this.state.definition.back.name === target.name
      );
    }

    if (target.event === 'attacking') {
      const event = last(this.game.state.event);
      if (event?.type === 'declaredAsDefender') {
        return event.attacker === this.id;
      } else {
        return false;
      }
    }

    if (target.side) {
      return target.side === this.state.sideUp;
    }

    if (target.hasShadow) {
      const shadows = this.game.getCards(target.hasShadow).map((c) => c.id);
      return this.state.shadows.some((s) => shadows.includes(s));
    }

    if (target.attachmentOf) {
      if (!this.state.attachedTo) {
        return false;
      }

      const targets = this.game.getCards(target.attachmentOf).map((c) => c.id);
      return targets.includes(this.state.attachedTo);
    }

    if (target.var) {
      const vars = getCardFromScope(this.game.scopes, target.var);
      return (vars && vars.includes(this.id)) ?? false;
    }

    throw new Error(`unknown card predicate: ${JSON.stringify(target)}`);
  }
}
