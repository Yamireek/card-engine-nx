import { keys } from '@card-engine-nx/basic';
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
  FormContainer,
  SelectElement,
  TextFieldElement,
  ToggleButtonGroupElement,
  useFormContext,
} from 'react-hook-form-mui';
import { GameSetupData } from '@card-engine-nx/engine';
import { Difficulty } from '@card-engine-nx/state';

const GameSetupForm = () => {
  const form = useFormContext();
  const playerCount = Number(form.watch('playerCount'));

  return (
    <Grid container spacing={2}>
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
    </Grid>
  );
};
export const GameSetupDialog = (props: {
  onSubmit: (setup: GameSetupData) => void;
}) => {
  return (
    <Dialog open maxWidth="sm" fullWidth>
      <FormContainer<{
        playerCount: '1' | '2' | '3' | '4';
        scenario: keyof typeof core.scenario;
        difficulty: Difficulty;
        extra: {
          resources: number;
          cards: number;
        };
        players: Array<keyof typeof decks>;
      }>
        defaultValues={{
          playerCount: '1',
          scenario: 'passageThroughMirkwood',
          difficulty: 'normal',
          extra: {
            resources: 0,
            cards: 0,
          },
        }}
        onSuccess={(data) => {
          console.log(data);
          props.onSubmit({
            players: data.players.map((key) => decks[key]),
            scenario: core.scenario[data.scenario],
            difficulty: data.difficulty,
            extra: data.extra,
          });
        }}
      >
        <DialogTitle>Choose decks and scenario</DialogTitle>
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
