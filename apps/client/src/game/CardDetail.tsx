import { useContext } from 'react';
import { CardId } from '@card-engine-nx/basic';
import { CardText } from './CardText';
import { DetailContext } from './DetailContext';
import { StateContext } from './StateContext';

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

export const CardDetail = (props: { cardId?: CardId }) => {
  const { ctx } = useContext(StateContext);
  const detail = useContext(DetailContext);
  const cardId = props.cardId ?? detail.cardId;

  if (!cardId) {
    return null;
  }

  const card = ctx.getCard(cardId);

  const name = card.props.name ?? card.state.definition.front.name ?? '';
  const exhaused = card.state.tapped ? 'E' : '';
  const unique = card.props.unique ? 'U' : '';

  return (
    <CardText
      title={`${name} (${card.state.id}) [${exhaused}${unique}]`}
      sphere={card.props.sphere ?? []}
      text={
        card.state.sideUp !== 'shadow'
          ? card.state.definition[card.state.sideUp].abilities?.map(
              (a) => a.description ?? ''
            ) ?? []
          : card.rules.shadows?.map((s) => s.description) ?? []
      }
      attachments={[]}
      traits={card.props.traits ?? []}
      properties={cardProperties.map((p) => ({
        name: p,
        printed: card.printed[p],
        current: card.props[p],
      }))}
      tokens={card.state.token}
      keywords={card.props.keywords ?? {}}
    />
  );
};
