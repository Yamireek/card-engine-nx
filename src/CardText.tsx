import { Sphere, Tokens, Trait } from '@card-engine-nx/basic';

type PropertyProps = { name: string; printed?: number; current?: number };

const valueWidth = 50;

const PropertyView = (props: PropertyProps) => {
  const printed = props.printed;
  const current = props.current;

  if (printed === undefined && current === undefined) {
    return null;
  }

  if (printed !== undefined && current !== undefined) {
    const bonus = current - printed;
    return (
      <tr>
        <td>{props.name}</td>
        {bonus > 0 && (
          <td style={{ width: valueWidth }}>
            {printed} (+
            {bonus})
          </td>
        )}
        {bonus === 0 && <td style={{ width: valueWidth }}>{printed}</td>}
        {bonus < 0 && (
          <td style={{ width: valueWidth }}>
            {printed} ({bonus})
          </td>
        )}
      </tr>
    );
  }

  return <>not implemened</>;
};

export const CardText = (props: {
  title: string;
  sphere: Sphere | undefined;
  properties: Array<PropertyProps>;
  tokens: Tokens;
  traits: Trait[];
  abilities: string[];
  attachments: string[];
}) => {
  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td colSpan={2} style={{ textAlign: 'center' }}>
            {props.title}
          </td>
        </tr>
        {props.properties.map((p) => (
          <PropertyView {...p} />
        ))}
        {props.tokens.damage > 0 && (
          <tr>
            <td>damage</td>
            <td>{props.tokens.damage}</td>
          </tr>
        )}
        {props.tokens.progress > 0 && (
          <tr>
            <td>progress</td>
            <td>{props.tokens.progress}</td>
          </tr>
        )}
        {props.tokens.resources > 0 && (
          <tr>
            <td>resources</td>
            <td>{props.tokens.resources}</td>
          </tr>
        )}
        {props.sphere && (
          <tr>
            <td>sphere</td>
            <td>{props.sphere}</td>
          </tr>
        )}
        <tr>
          <td>
            {props.traits.map((t) => (
              <>{t} </>
            ))}
          </td>
        </tr>
        {props.abilities.map((a, i) => (
          <tr>
            <td colSpan={2}>
              <b>{a}</b>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
