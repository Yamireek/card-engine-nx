import { useNavigate } from 'react-router-dom';
import { useSettings } from './useSettings';
import { SettingsDialog } from './SettingsDialog';

export const SettingsPage = () => {
  const navigate = useNavigate();

  const settings = useSettings();

  return (
    <SettingsDialog
      defaults={settings.value}
      onSubmit={(v) => {
        settings.set(v);
        navigate('/');
      }}
      onClose={() => navigate('/')}
    />
  );
};
