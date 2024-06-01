import { Editor } from '@monaco-editor/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from '@mui/material';
import {
  Controller,
  FormContainer,
  SelectElement,
  TextFieldElement,
  ToggleButtonGroupElement,
  useFormContext,
} from 'react-hook-form-mui';
import { keys } from '@card-engine-nx/basic';
import { core, decks } from '@card-engine-nx/cards';
import { SetupParams } from './types';

const GameSetupForm = () => {
  const form = useFormContext();
  const playerCount = Number(form.watch('playerCount'));

  const typeF = form.watch('type');

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ToggleButtonGroupElement
          name="type"
          exclusive
          enforceAtLeastOneSelected
          fullWidth
          options={[
            {
              id: 'new',
              label: 'New game',
            },
            {
              id: 'load',
              label: 'Load state',
            },
          ]}
        />
      </Grid>

      {typeF === 'load' && (
        <Grid item xs={12}>
          <Controller
            name="state"
            render={(f) => (
              <Editor
                height="290px"
                defaultLanguage="json"
                defaultValue={f.field.value}
                onChange={(v) => f.field.onChange(v)}
              />
            )}
          />
        </Grid>
      )}

      {typeF === 'new' && (
        <>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <ToggleButtonGroupElement
                label="Number of players"
                name="playerCount"
                exclusive
                enforceAtLeastOneSelected
                fullWidth
                options={['1', '2', '3', '4'].map((i) => ({ id: i, label: i }))}
              />
              {[...Array(playerCount).keys()].map((id) => (
                <SelectElement
                  key={id}
                  label={`Player ${id + 1} deck`}
                  name={`players[${id}]`}
                  options={keys(decks).map((key) => ({
                    id: key,
                    label: decks[key].name,
                  }))}
                  required
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={2}>
              <SelectElement
                label="Scenario"
                name="scenario"
                options={keys(core.scenario).map((key) => ({
                  id: key,
                  label: core.scenario[key].name,
                }))}
                required
              />
              <ToggleButtonGroupElement
                label="Difficulty"
                name="difficulty"
                exclusive
                enforceAtLeastOneSelected
                fullWidth
                options={[
                  {
                    id: 'easy',
                    label: 'Easy',
                  },
                  {
                    id: 'normal',
                    label: 'Normal',
                  },
                ]}
              />
              <TextFieldElement
                type="number"
                name="extra.resources"
                label="Extra resources"
              />
              <TextFieldElement
                type="number"
                name="extra.cards"
                label="Extra cards"
              />
            </Stack>
          </Grid>
        </>
      )}
    </Grid>
  );
};

const defaults = localStorage.getItem('setup');

export const GameSetupDialog = (props: {
  onSubmit: (setup: SetupParams) => void;
  onClose: () => void;
}) => {
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <FormContainer<SetupParams>
        defaultValues={
          defaults
            ? JSON.parse(defaults)
            : {
                type: 'new',
                playerCount: '1',
                scenario: 'passageThroughMirkwood',
                difficulty: 'normal',
                extra: {
                  resources: 0,
                  cards: 0,
                },
              }
        }
        onSuccess={(values) => {
          console.log(values);
          localStorage.setItem('setup', JSON.stringify(values));
          props.onSubmit(values);
        }}
      >
        <DialogTitle>Singleplayer</DialogTitle>
        <DialogContent
          sx={{ '.MuiDialogContent-root&.MuiDialogContent-root': { pt: 1 } }}
        >
          <GameSetupForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>close</Button>
          <Button type="submit" variant="contained">
            start
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};
