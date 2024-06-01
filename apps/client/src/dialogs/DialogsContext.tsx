/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { v4 as uuid } from 'uuid';

export type DialogProps<T> = {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: T) => void;
};

export type DialogContextValue = {
  open: <T, R, P>(params: {
    component: React.FunctionComponent<DialogProps<T> & P>;
    props?: Omit<P, keyof DialogProps<T>>;
    action: (value: T) => Promise<R>;
  }) => Promise<R>;
};

export const DialogContext = React.createContext<DialogContextValue>({
  open: () => {
    throw new Error('no DialogProvider');
  },
});

export const DialogProvider = (props: React.PropsWithChildren<unknown>) => {
  const [dialogs, setDialogs] = React.useState<
    Array<{
      id: string;
      component: React.FunctionComponent<any>;
    }>
  >([]);

  const open: DialogContextValue['open'] = ({ component, action, props }) =>
    new Promise((resolve, reject) => {
      const id = uuid();
      setDialogs((p) => [
        ...p,
        {
          id,
          component: () => {
            const Component = component as any;
            return (
              <Component
                open={true}
                onClose={() => {
                  reject();
                  setDialogs((p) => p.filter((d) => d.id !== id));
                }}
                onSubmit={async (v: any) => {
                  try {
                    const result = await action(v);
                    resolve(result);
                    setDialogs((p) => p.filter((d) => d.id !== id));
                  } catch (error) {
                    return;
                  }
                }}
                {...props}
              />
            );
          },
        },
      ]);
    });

  return (
    <DialogContext.Provider value={{ open }}>
      {props.children}
      {dialogs.map((dialog) => {
        return (
          <React.Fragment key={dialog.id}>
            {React.createElement(dialog.component)}
          </React.Fragment>
        );
      })}
    </DialogContext.Provider>
  );
};

export const useDialogs = () => React.useContext(DialogContext);
