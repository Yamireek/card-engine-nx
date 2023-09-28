import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardText } from './CardText';
import { DetailContext } from './DetailContext';

const cardProperties = [
  'cost',
  'threat',
  'threatCost',
  'engagement',
  'willpower',
  'attack',
  'defense',
  'hitPoints',
  'sequence',
  'questPoints',
] as const;

export const CardDetail = () => {
  const { state, view } = useContext(StateContext);
  const { cardId } = useContext(DetailContext);

  if (!cardId) {
    return null;
  }

  const card = {
    state: state.cards[cardId],
    view: view.cards[cardId],
  };

  const name = card.view.props.name ?? 'uknown';
  const exhaused = card.state.tapped ? 'E' : '';
  const unique = card.view.props.unique ? 'U' : '';

  return (
    <CardText
      title={`${name} (${card.state.id}) [${exhaused}${unique}]`}
      sphere={card.view.props.sphere}
      abilities={card.view.abilities}
      attachments={[]}
      traits={card.view.props.traits ?? []}
      properties={cardProperties.map((p) => ({
        name: p,
        printed: card.view.printed[p],
        current: card.view.props[p],
      }))}
      tokens={card.state.token}
      keywords={card.view.props.keywords ?? {}}
    />
  );
};
