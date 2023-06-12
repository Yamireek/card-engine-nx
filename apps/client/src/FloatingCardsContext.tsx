import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { Card3dProps } from './Card3d';

export type FloatingCardsContextProps = {
  floatingCards: Card3dProps[];
  setFloatingCards: Dispatch<SetStateAction<Card3dProps[]>>;
};

export const FloatingCardsContext = createContext<FloatingCardsContextProps>(
  undefined as never
);

export const FloatingCardsProvider = (
  props: React.PropsWithChildren<unknown>
) => {
  const [cards, setCards] = useState<Card3dProps[]>([]);

  return (
    <FloatingCardsContext.Provider
      value={{ floatingCards: cards, setFloatingCards: setCards }}
    >
      {props.children}
    </FloatingCardsContext.Provider>
  );
};

export const useFloatingCards = () => useContext(FloatingCardsContext);
