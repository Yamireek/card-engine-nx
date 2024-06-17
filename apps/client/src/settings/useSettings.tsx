import { useLocalStorage } from 'react-use';

export type Settings = {
  playerName: string;
  serverUrl: string;
};

const SERVER_URL =
  window.location.origin === 'http://localhost:4200'
    ? 'http://localhost:3000'
    : 'https://card-engine-server.onrender.com';
const DEFALULT_SETTINGS: Settings = {
  playerName: '',
  serverUrl: SERVER_URL,
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage(
    'settings',
    DEFALULT_SETTINGS
  );

  return {
    value: settings ?? DEFALULT_SETTINGS,
    set: (s: Settings) => setSettings(s),
  };
};
