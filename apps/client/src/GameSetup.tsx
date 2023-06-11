import { useContext } from 'react';
import { StateContext } from './StateContext';
import { values } from '@card-engine-nx/basic';
import { coreTactics } from './decks/coreTactics';
import { core } from '@card-engine-nx/cards';
import { DetailProvider } from './DetailContext';
import { GameDisplay } from './GameDisplay';
import { ChooseSingleDialog } from '@card-engine-nx/ui';
import { Dialog } from '@mui/material';

export const GameSetup = () => {
  const { state, moves, playerId } = useContext(StateContext);

  if (state.phase !== 'setup') {
    return (
      <DetailProvider>
        <GameDisplay />
      </DetailProvider>
    );
  }

  const waitingPlayers = values(state.players)
    .filter((p) => p.zones.library.cards.length === 0)
    .map((p) => p.id);

  if (waitingPlayers.length > 0) {
    if (!playerId || waitingPlayers.includes(playerId)) {
      return (
        <ChooseSingleDialog
          title="Choose deck"
          choices={[
            {
              title: 'Core Tactics',
              action: () => moves.selectDeck(coreTactics),
            },
          ]}
          skippable={false}
        />
      );
    } else {
      return (
        <Dialog open>
          Waiting for others to select deck: {waitingPlayers}
        </Dialog>
      );
    }
  }

  if (state.zones.questDeck.cards.length === 0) {
    return (
      <ChooseSingleDialog
        title="Choose scenario"
        choices={[
          {
            title: 'Passage Through Mirkwood',
            action: () =>
              moves.selectScenario(core.scenario.passageThroughMirkwood),
          },
        ]}
        skippable={false}
      />
    );
  }

  return null;
};
