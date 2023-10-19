import {
  Keywords,
  Sphere,
  Tokens,
  Trait,
  capitalizeFirst,
} from '@card-engine-nx/basic';
import React from 'react';

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
  sphere: Sphere[];
  properties: Array<PropertyProps>;
  tokens: Tokens;
  traits: Trait[];
  text: string[];
  attachments: string[];
  keywords: Keywords;
}) => {
  return (
    <table>
      <tbody>
        <tr>
          <td colSpan={2} style={{ textAlign: 'center' }}>
            {props.title}
          </td>
        </tr>
        {props.properties.map((p) => (
          <PropertyView key={p.name} {...p} />
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
        {props.sphere?.length > 0 && (
          <tr>
            <td>sphere</td>
            <td>{props.sphere.join(', ')}</td>
          </tr>
        )}
        <tr>
          <td colSpan={2}>
            <span
              style={{
                textAlign: 'center',
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              {props.traits
                .map((t) => {
                  return capitalizeFirst(t) + '.';
                })
                .join(' ')}
            </span>
          </td>
        </tr>
        <tr>
          <td>
            {Object.keys(props.keywords).map((k) => (
              <span key={k}>{capitalizeFirst(k)}.</span>
            ))}
          </td>
        </tr>
        {props.text.map((a, i) => (
          <tr key={i}>
            <td colSpan={2}>{a}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
