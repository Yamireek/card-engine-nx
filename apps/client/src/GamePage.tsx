import { useLocation } from 'react-router-dom';
import { Game } from './Game';


export const GamePage = () => {
  const location = useLocation();
  return <Game setup={location.state} />;
};
