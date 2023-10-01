import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  Typography,
} from '@mui/material';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ChooseMultiDialog = <T extends unknown>(props: {
  title: string;
  choices: {
    title: string;
    image?: {
      src: string;
      width: number;
      height: number;
    };
    id: T;
  }[];
  onSubmit: (ids: T[]) => void;
}) => {
  const [selected, setSelected] = useState<T[]>([]);

  return (
    <Dialog open={true} maxWidth="md">
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <List
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
          }}
        >
          {props.choices.map((o, i) => (
            <ListItemButton
              key={i}
              style={{ flex: o.image?.src ? '0 0 auto' : undefined }}
              onClick={(e) => {
                e.stopPropagation();
                const filtered = selected.includes(o.id)
                  ? selected.filter((s) => s !== o.id)
                  : [...selected, o.id];

                setSelected(filtered);
              }}
            >
              {o.image?.src ? (
                <img
                  alt=""
                  src={o.image?.src}
                  style={{
                    width: o.image?.width,
                    height: o.image?.height,
                    position: 'relative',
                    opacity: selected.includes(o.id) ? 1 : 0.5,
                  }}
                />
              ) : (
                <Typography
                  style={{
                    opacity: selected.includes(o.id) ? 1 : 0.5,
                  }}
                >
                  {o.title}
                </Typography>
              )}
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onSubmit(selected);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
