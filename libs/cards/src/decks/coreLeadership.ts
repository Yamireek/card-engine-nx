import * as ally from '../allies';
import * as attachment from '../attachments';
import * as event from '../events';
import * as hero from '../heroes';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreLeadership: PlayerDeck = {
  name: 'Core (Leadership)',
  heroes: [hero.aragorn, hero.theodred, hero.gloin],
  library: [
    ally.guardOfTheCitadel,
    ally.guardOfTheCitadel,
    ally.guardOfTheCitadel,
    ally.faramir,
    ally.faramir,
    ally.sonOfArnor,
    ally.sonOfArnor,
    ally.snowbournScout,
    ally.snowbournScout,
    ally.snowbournScout,
    ally.silverlodeArcher,
    ally.silverlodeArcher,
    ally.longbeardOrcSlayer,
    ally.longbeardOrcSlayer,
    ally.brokIronfist,
    event.everVigilant,
    event.everVigilant,
    event.commonCause,
    event.commonCause,
    event.forGondor,
    event.forGondor,
    event.sneakAttack,
    event.sneakAttack,
    event.valiantSacrifice,
    event.valiantSacrifice,
    event.grimResolve,
    attachment.stewardOfGondor,
    attachment.stewardOfGondor,
    attachment.celebriansStone,
    ally.gandalf,
    ally.gandalf,
    ally.gandalf,
  ],
};
