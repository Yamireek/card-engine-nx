import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@mui/material';

export const LoadingDialog = () => (
  <Dialog open maxWidth="md" fullWidth>
    <DialogTitle>Loading...</DialogTitle>
    <DialogContent>
      <LinearProgress />
    </DialogContent>
  </Dialog>
);
