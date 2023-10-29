import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';
import { min, sum } from 'lodash/fp';

export type Amount<T> = { id: T; value: number };

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ChooseDistributionDialog = <T extends unknown>(props: {
  title: string;
  total: {
    min: number;
    max: number;
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
    min: number;
    max: number;
  }[];
  onSubmit: (amounts: Array<number>) => void;
}) => {
  const [amounts, setAmounts] = useState<Array<number>>(
    props.choices.map((c) => c.min ?? 0)
  );

  const total = sum(amounts);
  const count = amounts.filter((a) => a).length;

  const totalMax = total <= props.total.max;
  const totalMin = total >= props.total.min;

  const countMax = props.count?.max ? count <= props.count.max : true;
  const countMin = props.count?.min ? count >= props.count.min : true;

  const canSubmit = totalMax && totalMin && countMax && countMin;

  const remains = props.total.max - total;

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

            const minAmount = o.min;
            const maxAmount = min([o.max, props.total.max]) as number;

            return (
              <div
                key={index}
                style={{ display: 'flex', flexDirection: 'column', margin: 4 }}
              >
                <ListItemButton
                  style={{ flex: '0 0 auto' }}
                  onClick={(e) => {
                    const remainPart = o.max - amount;
                    setAmounts((p) =>
                      p.map((a, i) =>
                        index === i ? a + (min([remainPart, remains]) ?? 0) : a
                      )
                    );
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
                <ToggleButtonGroup
                  value={amount}
                  exclusive
                  onChange={(_, v) => {
                    setAmounts((p) => p.map((a, i) => (index === i ? v : a)));
                  }}
                  style={{ justifyContent: 'space-evenly' }}
                >
                  {Array.from(
                    { length: maxAmount - minAmount + 1 },
                    (_, i) => i + minAmount
                  ).map((v) => {
                    const adds = v - amount;
                    return (
                      <ToggleButton
                        value={v}
                        key={v}
                        style={{ flexGrow: 1 }}
                        disabled={adds > 0 && adds > remains}
                      >
                        {v}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
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
