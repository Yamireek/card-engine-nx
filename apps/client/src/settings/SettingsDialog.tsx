import { Dialog } from '@mui/material';
import { FormContainer } from 'react-hook-form-mui';
import { SettingsForm } from './SettingsForm';
import { Settings } from './useSettings';

export const SettingsDialog = (props: {
  defaults: Settings;
  onSubmit: (settings: Settings) => void;
  onClose: () => void;
}) => {
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <FormContainer<Settings>
        defaultValues={props.defaults}
        onSuccess={(values) => {
          props.onSubmit(values);
        }}
      >
        <SettingsForm onClose={props.onClose} />
      </FormContainer>
    </Dialog>
  );
};
