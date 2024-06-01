/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, createElement } from 'react';
import { Fragment } from 'react/jsx-runtime';
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

export const DialogContext = createContext<DialogContextValue>({
  open: () => {
    throw new Error('no DialogProvider');
  },
});

export const DialogProvider = (props: React.PropsWithChildren<unknown>) => {
  const [dialogs, setDialogs] = useState<
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
          <Fragment key={dialog.id}>{createElement(dialog.component)}</Fragment>
        );
      })}
    </DialogContext.Provider>
  );
};

export const useDialogs = () => React.useContext(DialogContext);
