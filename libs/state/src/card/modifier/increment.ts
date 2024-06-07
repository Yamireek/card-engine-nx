import { CardNumProp } from '@card-engine-nx/basic';
import { NumberExpr } from '../../expression/number';

export type PropertyIncrement = Partial<Record<CardNumProp, NumberExpr>>;
