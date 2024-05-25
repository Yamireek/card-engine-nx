import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ListItemButton,
  Typography,
} from '@mui/material';
import { MinimizeDialogButton } from './MinimizeDialogButton';

export const ChooseSingleDialog = (props: {
  title: string;
  skippable: boolean;
  choices: Array<{
    title: string;
    image?: {
      src: string;
      width: number;
      height: number;
    };
    action: () => void;
  }>;
  onSkip?: () => void;
  onMinimize?: () => void;
}) => {
  return (
    <Dialog open={true} maxWidth="md">
      <DialogTitle>{props.title}</DialogTitle>
      <MinimizeDialogButton onMinimize={props.onMinimize} />
      <DialogContent>
        <Grid container spacing={1} justifyContent="space-evenly">
          {props.choices.map((a, i) => (
            <Grid key={i} item xs={!a.image ? 12 : 'auto'}>
              <ListItemButton
                key={a.title}
                onClick={() => {
                  a.action();
                }}
                style={{ flex: '0 0 auto' }}
              >
                {a.image ? (
                  <img
                    alt=""
                    src={a.image.src}
                    style={{
                      width: a.image.width,
                      height: a.image.height,
                      position: 'relative',
                    }}
                  />
                ) : (
                  <Typography>{a.title}</Typography>
                )}
              </ListItemButton>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      {props.skippable && (
        <DialogActions>
          <Button onClick={props.onSkip}>Skip</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
