import { Icon, IconButton } from '@mui/material';

export const MinimizeDialogButton = (props: { onMinimize?: () => void }) => {
  if (!props.onMinimize) {
    return null;
  }

  return (
    <IconButton
      onClick={props.onMinimize}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <Icon>minimize</Icon>
    </IconButton>
  );
};
