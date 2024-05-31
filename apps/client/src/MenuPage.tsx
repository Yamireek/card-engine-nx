import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Icon,
  Stack,
} from '@mui/material';

export const MenuPage = (props: {
  items: Array<{ label: string; link: string; icon: string }>;
}) => {
  return (
    <Dialog open>
      <DialogTitle sx={{ textAlign: 'center' }}>Main menu</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack>
          {props.items.map((item) => (
            <Button
              key={item.link}
              startIcon={<Icon>{item.icon}</Icon>}
              href={item.link}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
