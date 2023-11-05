import * as ally from '../cards/allies';
import * as attachment from '../cards/attachments';
import * as event from '../cards/events';
import * as hero from '../cards/heroes';
import { PlayerDeck } from '@card-engine-nx/state';

export const coreTactics: PlayerDeck = {
  name: 'Core (Tactics)',
  heroes: [hero.gimli, hero.legolas, hero.thalin],
  library: [
    ally.veteranAxehand,
    ally.veteranAxehand,
    ally.veteranAxehand,
    ally.gondorianSpearman,
    ally.gondorianSpearman,
    ally.gondorianSpearman,
    ally.horsebackArcher,
    ally.horsebackArcher,
    ally.beorn,
    event.bladeMastery,
    event.bladeMastery,
    event.bladeMastery,
    event.rainOfArrows,
    event.rainOfArrows,
    event.feint,
    event.feint,
    event.quickStrike,
    event.quickStrike,
    event.thicketOfSpears,
    event.thicketOfSpears,
    event.swiftStrike,
    event.standTogether,
    attachment.bladeOfGondolin,
    attachment.bladeOfGondolin,
    attachment.citadelPlate,
    attachment.citadelPlate,
    attachment.dwarvenAxe,
    attachment.dwarvenAxe,
    attachment.hornOfGondor,
    ally.gandalf,
    ally.gandalf,
    ally.gandalf,
  ],
};
