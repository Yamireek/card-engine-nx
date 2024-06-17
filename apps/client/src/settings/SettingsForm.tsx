import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { TextFieldElement, useFormContext } from 'react-hook-form-mui';

export const SettingsForm = (props: { onClose: () => void }) => {
  const f = useFormContext();

  return (
    <>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent
        sx={{ '.MuiDialogContent-root&.MuiDialogContent-root': { pt: 1 } }}
      >
        <Stack spacing={2}>
          <TextFieldElement
            name="playerName"
            label="Player name"
            fullWidth
            required
          />
          <TextFieldElement
            name="serverUrl"
            label="Server URL"
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>close</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!f.formState.isValid}
        >
          save
        </Button>
      </DialogActions>
    </>
  );
};
