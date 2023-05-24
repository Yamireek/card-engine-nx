export function keys<TK extends string | number, TI>(
  records: Partial<Record<TK, TI>>
) {
  return Object.keys(records) as TK[];
}
