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
import { CardDefinition } from '@card-engine-nx/state';
import { CardDisplay, getCardImageUrl } from '@card-engine-nx/ui';

export const Cards = (props: { cards: Record<string, CardDefinition> }) => {
  return (
    <>
      {values(props.cards).map((card) => (
        <Grid item>
          <Paper style={{ height: 500 / 5, width: 360 / 5 }}>
            <CardDisplay
              image={getCardImageUrl(card.front, 'front')}
              orientation="landscape"
              scale={1}
            />
          </Paper>
        </Grid>
      ))}
    </>
  );
};

export const CollectionPage = () => {
  const navigate = useNavigate();
  return (
    <Dialog open maxWidth={false} fullWidth>
      <DialogTitle>Collection</DialogTitle>
      <DialogContent style={{ height: '100vh' }}>
        <Grid container spacing={1} justifyContent="space-around">
          <Cards cards={core.hero} />
          <Cards cards={core.ally} />
          <Cards cards={core.event} />
          <Cards cards={core.attachment} />
          <Cards cards={core.enemy} />
          <Cards cards={core.location} />
          <Cards cards={core.treachery} />
          <Cards cards={core.quest} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate('/')}>close</Button>
      </DialogActions>
    </Dialog>
  );
};
