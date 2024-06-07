import { reverse } from "lodash/fp";
import { CardId, PlayerId, ZoneId } from "@card-engine-nx/basic";
import { Scope } from "@card-engine-nx/state";

export function getZoneType(zone: ZoneId) {
  if (typeof zone === "string") {
    return zone;
  }

  return zone.type;
}

export function getPlayerFromScope(
  scopes: Scope[],
  name: string
): PlayerId[] | undefined {
  const reversed = reverse(scopes);
  const scope = reversed.find((s) => s.player && s.player[name]);
  return scope?.player?.[name];
}

export function getCardFromScope(
  scopes: Scope[],
  name: string
): CardId[] | undefined {
  const reversed = reverse(scopes);
  const scope = reversed.find((s) => s.card && s.card[name]);
  return scope?.card?.[name];
}
