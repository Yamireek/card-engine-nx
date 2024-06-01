import { useNavigate } from 'react-router-dom';
import { SettingsDialog } from './SettingsDialog';
import { useSettings } from './useSettings';

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
