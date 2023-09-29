import { Event } from '@card-engine-nx/state';
import { ExecutionContext } from '../context';
import { sequence } from '../utils/sequence';
import { values } from '@card-engine-nx/basic';

export function processReponses(
  event: Exclude<Event, 'none'>,
  ctx: ExecutionContext
) {
  const reponses = values(ctx.view.cards).flatMap(
    (c) => c.responses?.[event.type]?.map((r) => ({ ...r, cardId: c.id })) ?? []
  );

  if (reponses.length > 0) {
    ctx.state.next.unshift({
      player: {
        target: 'first',
        action: {
          chooseActions: {
            title: 'Choose responses for event ' + event.type,
            actions: reponses.map((r) => ({
              title: r.description,
              action: sequence(
                {
                  setEvent: event,
                },
                { setCardVar: { name: 'self', value: r.cardId } },
                r.action,
                { setCardVar: { name: 'self', value: undefined } },
                {
                  setEvent: 'none',
                }
              ),
            })),
            optional: true,
            multi: true,
          },
        },
      },
    });
  }
}
