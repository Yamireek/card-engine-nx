import { useContext } from 'react';
import { StateContext } from './StateContext';
import { DetailProvider } from './DetailContext';
import { GameDisplay } from './GameDisplay';
import { GameDialogs } from './GameDialogs';

export const GameSetup = () => {
  const { state } = useContext(StateContext);

  if (state.phase !== 'setup') {
    return (
      <DetailProvider>
        <GameDisplay />
      </DetailProvider>
    );
  }

  return <GameDialogs />;
};
