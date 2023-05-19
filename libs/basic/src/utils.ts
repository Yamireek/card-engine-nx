export function keys<TK extends string | number, TI>(records: Record<TK, TI>) {
  return Object.keys(records) as TK[];
}
