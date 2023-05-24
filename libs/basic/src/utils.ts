export function keys<TK extends string | number, TI>(
  records: Partial<Record<TK, TI>>
) {
  return Object.keys(records) as TK[];
}

export function values<TK extends string | number, TI>(
  records: Partial<Record<TK, TI>>
) {
  return Object.values(records) as TI[];
}
