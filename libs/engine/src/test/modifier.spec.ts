import { it, expect } from 'vitest';
import { PrintedProps } from '@card-engine-nx/state';
import { applyModifiers } from '../utils';

it('No modifier', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, []);
  expect(props.attack).toBe(1);
});

it('Increment number', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'inc',
      value: 1,
    },
  ]);
  expect(props.attack).toBe(2);
});

it('Multiply number', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'mul',
      value: 2,
    },
  ]);
  expect(props.attack).toBe(2);
});

it('Set number', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'set',
      value: 5,
    },
  ]);
  expect(props.attack).toBe(5);
});

it('Set as priority', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'mul',
      value: 2,
    },
    {
      prop: 'attack',
      op: 'set',
      value: 5,
    },
    {
      prop: 'attack',
      op: 'inc',
      value: 2,
    },
  ]);
  expect(props.attack).toBe(5);
});

it('Inc before mul', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'mul',
      value: 2,
    },
    {
      prop: 'attack',
      op: 'inc',
      value: 2,
    },
  ]);
  expect(props.attack).toBe(6);
});

it('Minimal value 0', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'inc',
      value: -2,
    },
  ]);
  expect(props.attack).toBe(0);
});

it('Round value up', () => {
  const printed: PrintedProps = { type: 'ally', attack: 1 };
  const props = applyModifiers(printed, [
    {
      prop: 'attack',
      op: 'mul',
      value: 1.5,
    },
  ]);
  expect(props.attack).toBe(2);
});

it('Add trait', () => {
  const printed: PrintedProps = { type: 'ally', traits: ['archer'] };
  const props = applyModifiers(printed, [
    {
      prop: 'traits',
      op: 'add',
      value: ['beorning', 'archer'],
    },
  ]);
  expect(props.traits).toEqual(['archer', 'beorning']);
});

it('Add sphere', () => {
  const printed: PrintedProps = { type: 'ally', sphere: ['leadership'] };
  const props = applyModifiers(printed, [
    {
      prop: 'sphere',
      op: 'add',
      value: ['lore'],
    },
  ]);
  expect(props.sphere).toEqual(['leadership', 'lore']);
});

it('Add keyword', () => {
  const printed: PrintedProps = { type: 'ally', keywords: { sentinel: true } };
  const props = applyModifiers(printed, [
    {
      prop: 'keywords',
      op: 'add',
      value: { ranged: true },
    },
  ]);
  expect(props.keywords).toEqual({
    ranged: true,
    sentinel: true,
  });
});
