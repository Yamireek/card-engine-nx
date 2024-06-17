export type PlayerRules = {
  multipleDefenders?: true;
  disableDraw?: true;
};

export function mergePlayerRules(...list: PlayerRules[]): PlayerRules {
  return list.reduce(
    (p, c) => ({
      disableDraw: p.disableDraw || c.disableDraw,
      multipleDefenders: p.multipleDefenders || c.multipleDefenders,
    }),
    {}
  );
}
