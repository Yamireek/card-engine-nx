import { PlayerDeck } from '@card-engine-nx/state';
import * as ally from '../cards/allies';
import * as attachment from '../cards/attachments';
import * as event from '../cards/events';
import * as hero from '../cards/heroes';

export const coreLore: PlayerDeck = {
  name: 'Core (Lore)',
  heroes: [hero.denethor, hero.glorfindel, hero.beravor],
  library: [
    ally.daughterOfTheNimrodel,
    ally.daughterOfTheNimrodel,
    ally.daughterOfTheNimrodel,
    ally.ereborHammersmith,
    ally.ereborHammersmith,
    ally.henamarthRiversong,
    ally.minerOfTheIronHills,
    ally.minerOfTheIronHills,
    ally.gleowine,
    ally.gleowine,
    event.loreOfImladris,
    event.loreOfImladris,
    event.loreOfImladris,
    event.loriensWealth,
    event.loriensWealth,
    event.radagastsCunning,
    event.radagastsCunning,
    event.secretPaths,
    event.secretPaths,
    event.gandalfsSearch,
    event.gandalfsSearch,
    event.beornsHospitality,
    attachment.forestSnare,
    attachment.forestSnare,
    attachment.protectorOfLorien,
    attachment.protectorOfLorien,
    attachment.darkKnowledge,
    attachment.selfPreservation,
    attachment.selfPreservation,
    ally.gandalf,
    ally.gandalf,
    ally.gandalf,
  ],
};
