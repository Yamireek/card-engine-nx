import { CssBaseline } from '@mui/material';
import { Game } from './Game';

export const App = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <CssBaseline />
      <Game
        players={1}
        playerID={window.location.hash.substring(1)}
        multiplayer={false}
        server="localhost:3000"
      />
    </div>
  );
};
