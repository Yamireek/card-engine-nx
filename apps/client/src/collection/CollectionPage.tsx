import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { values } from '@card-engine-nx/basic';
import { core } from '@card-engine-nx/cards';
import { CardDisplay, getCardImageUrl } from '@card-engine-nx/ui';

export const CollectionPage = () => {
  const navigate = useNavigate();
  return (
    <Dialog open maxWidth={false} fullWidth>
      <DialogTitle>Collection</DialogTitle>
      <DialogContent style={{ height: '100vh' }}>
        <Grid container spacing={1} justifyContent="space-around">
          {values(core.hero).map((card) => (
            <Grid item>
              <Paper style={{ height: 500, width: 360 }}>
                <CardDisplay
                  image={getCardImageUrl(card.front, 'front')}
                  orientation="landscape"
                  scale={1}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate('/')}>close</Button>
      </DialogActions>
    </Dialog>
  );
};
