import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export type Amount<T> = { id: T; value: number };

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ChooseDistributionDialog = <T extends unknown>(props: {
  title: string;
  total?: {
    min?: number;
    max?: number;
  };
  count?: {
    min?: number;
    max?: number;
  };
  choices: {
    title: string;
    image?: {
      src: string;
      width: number;
      height: number;
    };
    id: T;
    min?: number;
    max?: number;
  }[];
  onSubmit: (amounts: Array<Amount<T>>) => void;
}) => {
  const theme = useTheme();

  const [amounts, setAmounts] = useState<Array<Amount<T>>>(
    props.choices.map((c) => ({ id: c.id, value: c.min ?? 0 }))
  );

  const total = amounts.reduce((p, c) => p + c.value, 0);
  const count = amounts.filter((a) => a.value).length;

  const maxTotalLimit = props.total?.max ? total >= props.total.max : false;

  const totalMax = props.total?.max ? total <= props.total.max : true;
  const totalMin = props.total?.min ? total >= props.total.min : true;

  const countMax = props.count?.max ? count <= props.count.max : true;
  const countMin = props.count?.min ? count >= props.count.min : true;

  const canSubmit = totalMax && totalMin && countMax && countMin;

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
          {props.choices.map((o, i) => {
            const amount = amounts.find((a) => a.id === o.id)?.value ?? 0;

            const minLimit = o.min ? amount <= o.min : amount <= 0;
            const maxLimit = o.max ? amount >= o.max : undefined;

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <ListItemButton
                  style={{ flex: '0 0 auto' }}
                  onClick={(e) => {
                    if (!(maxLimit || maxTotalLimit)) {
                      setAmounts((p) =>
                        p.map((a) =>
                          a.id === o.id ? { ...a, value: a.value + 1 } : a
                        )
                      );
                    }
                  }}
                >
                  <img
                    alt=""
                    src={o.image?.src}
                    style={{
                      width: o.image?.width,
                      height: o.image?.height,
                      position: 'relative',
                      opacity: amount > 0 ? 1 : 0.5,
                    }}
                  />
                </ListItemButton>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    disabled={maxLimit || maxTotalLimit}
                    onClick={() => {
                      setAmounts((p) =>
                        p.map((a) =>
                          a.id === o.id ? { ...a, value: a.value + 1 } : a
                        )
                      );
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    disabled
                    style={{ color: theme.palette.text.primary }}
                  >
                    {amount}
                  </IconButton>
                  <IconButton
                    disabled={minLimit}
                    onClick={() => {
                      setAmounts((p) =>
                        p.map((a) =>
                          a.id === o.id ? { ...a, value: a.value - 1 } : a
                        )
                      );
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!canSubmit}
          onClick={() => {
            props.onSubmit(amounts);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
