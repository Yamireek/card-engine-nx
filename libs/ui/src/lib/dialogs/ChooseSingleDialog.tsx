import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  ListItemButton,
  Typography,
} from '@mui/material';

export const ChooseSingleDialog = (props: {
  title: string;
  choices: Array<{
    title: string;
    image?: {
      src: string;
      width: number;
      height: number;
    };
    action: () => void;
  }>;
}) => {
  return (
    <Dialog open={true} maxWidth="md">
      <DialogTitle>{props.title}</DialogTitle>
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
    </Dialog>
  );
};
