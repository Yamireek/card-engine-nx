import { core } from '@card-engine-nx/cards';
import { PlayerDeck, event } from '@card-engine-nx/state';

export const discardTargetCard = event(
  {
    cost: 0,
    name: 'A Test of Will',
    sphere: 'neutral',
  },
  {
    description: 'Discard target card',
    action: {
      player: '0',
      action: {
        chooseCardActions: {
          title: 'Choose card',
          target: { zoneType: 'playerArea' },
          action: 'discard',
        },
      },
    },
  }
);

export const coreTest: PlayerDeck = {
  name: 'Test',
  heroes: [
    core.hero.gimli,
    core.hero.aragorn,
    core.hero.eowyn,
    core.hero.denethor,
  ],
  library: [
    core.ally.henamarthRiversong,
    core.event.grimResolve,
    core.ally.ereborHammersmith,
    core.attachment.darkKnowledge,
    discardTargetCard,
    discardTargetCard,
    discardTargetCard,
    core.ally.gandalf,
  ],
};
