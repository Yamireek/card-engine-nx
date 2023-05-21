import { Fab, Icon, Typography } from '@mui/material';

export const NextStepButton = (props: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <Fab
      color="primary"
      variant="extended"
      style={{ position: 'fixed', right: 8, bottom: 8 }}
      onClick={() => props.onClick()}
    >
      <Icon style={{ marginBottom: 3 }}>skip_next</Icon>
      <Typography>{props.title}</Typography>
    </Fab>
  );
};
