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
import { min, sum } from 'lodash/fp';

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
  onSubmit: (amounts: Array<number>) => void;
}) => {
  const theme = useTheme();

  const [amounts, setAmounts] = useState<Array<number>>(
    props.choices.map((c) => c.min ?? 0)
  );

  const total = sum(amounts);
  const count = amounts.filter((a) => a).length;

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
          {props.choices.map((o, index) => {
            const amount = amounts[index];

            const minLimit = o.min ? amount <= o.min : amount <= 0;
            const maxLimit = o.max ? amount >= o.max : undefined;

            return (
              <div
                key={index}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <ListItemButton
                  style={{ flex: '0 0 auto' }}
                  onClick={(e) => {
                    if (!(maxLimit || maxTotalLimit)) {
                      if (props.total?.max && o.max) {
                        const remainTotal = props.total.max - total;
                        const remainPart = o.max - amount;
                        setAmounts((p) =>
                          p.map((a, i) =>
                            index === i
                              ? a + (min([remainPart, remainTotal]) ?? 0)
                              : a
                          )
                        );
                      } else {
                        setAmounts((p) =>
                          p.map((a, i) => (index === i ? a + 1 : a))
                        );
                      }
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
                        p.map((a, i) => (index === i ? a + 1 : a))
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
                        p.map((a, i) => (index === i ? a - 1 : a))
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
