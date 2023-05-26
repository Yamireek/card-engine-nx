import { State, View } from '@card-engine-nx/state';
import React, { useMemo } from 'react';
import { createView } from '@card-engine-nx/engine';


export const StateContext = React.createContext<{
    state: State;
    view: View;
    setState: (newState: State) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}>({} as any);

export const StateProvider = (
    props: React.PropsWithChildren<{ init: State; }>
) => {
    const [state, setState] = React.useState<State>(props.init);
    const view = useMemo(() => createView(state), [state]);

    return (
        <StateContext.Provider value={{ state, setState, view }}>
            {props.children}
        </StateContext.Provider>
    );
};

export function useGameState() {
    return React.useContext(StateContext);
}
