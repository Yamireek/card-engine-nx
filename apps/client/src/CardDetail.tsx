import { useContext } from 'react';
import { StateContext } from './StateContext';
import { CardText } from './CardText';
import { DetailContext } from './DetailContext';
import { Paper } from '@mui/material';

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

  const name = card.view.props.name ?? card.state.definition.front.name ?? '';
  const exhaused = card.state.tapped ? 'E' : '';
  const unique = card.view.props.unique ? 'U' : '';

  return (
    <Paper
      style={{
        position: 'absolute',
        width: 300,
        background: 'rgba(255,255,255,0.75)',
        padding: 8,
        zIndex: 10,
      }}
    >
      <CardText
        title={`${name} (${card.state.id}) [${exhaused}${unique}]`}
        sphere={card.view.props.sphere}
        text={
          card.state.sideUp !== 'shadow'
            ? [
                ...card.state.definition[card.state.sideUp].abilities.map(
                  (a) => a.description ?? ''
                ),
                ...card.view.effects,
              ]
            : card.view.shadows.map((s) => s.description)
        }
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
    </Paper>
  );
};
