import { Difficulty, keys } from '@card-engine-nx/basic';
import { core, decks } from '@card-engine-nx/cards';
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
import { GameSetupData } from '@card-engine-nx/engine';
import { Editor } from '@monaco-editor/react';

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
              id: 'scenario',
              label: 'Start scenario',
            },
            {
              id: 'state',
              label: 'Load state',
            },
          ]}
        />
      </Grid>

      {typeF === 'state' && (
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

      {typeF === 'scenario' && (
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

type GameSetupFormData =
  | {
      type: 'scenario';
      playerCount: '1' | '2' | '3' | '4';
      players: Array<keyof typeof decks>;
      scenario: keyof typeof core.scenario;
      difficulty: Difficulty;
      extra: {
        resources: number;
        cards: number;
      };
    }
  | { type: 'state'; state: string };

export const GameSetupDialog = (props: {
  onSubmit: (setup: GameSetupData) => void;
}) => {
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <FormContainer<GameSetupFormData>
        defaultValues={
          defaults
            ? JSON.parse(defaults)
            : {
                type: 'scenario',
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

          if (values.type === 'scenario') {
            props.onSubmit({
              type: 'scenario',
              data: {
                players: values.players
                  .filter((p, i) => i < Number(values.playerCount))
                  .map((key) => decks[key]),
                scenario: core.scenario[values.scenario],
                difficulty: values.difficulty,
                extra: values.extra,
              },
            });
          } else {
            props.onSubmit({
              type: 'state',
              state: JSON.parse(values.state),
            });
          }
        }}
      >
        <DialogTitle>Choose setup data</DialogTitle>
        <DialogContent
          sx={{ '.MuiDialogContent-root&.MuiDialogContent-root': { pt: 1 } }}
        >
          <GameSetupForm />
        </DialogContent>
        <DialogActions>
          <Button>close</Button>
          <Button type="submit" variant="contained">
            start
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};
