import * as React from 'react';
import { CardId } from '@card-engine-nx/basic';

export const DetailContext = React.createContext<{
  cardId?: CardId | undefined;
  setDetail: (id?: CardId) => void;
}>({
  setDetail: (cardID) => {
    throw new Error('use DetailProvider');
  },
});

export const DetailProvider = (props: React.PropsWithChildren<unknown>) => {
  const [detailId, setDetail] = React.useState<CardId | undefined>();

  return (
    <DetailContext.Provider value={{ cardId: detailId, setDetail }}>
      {props.children}
    </DetailContext.Provider>
  );
};
