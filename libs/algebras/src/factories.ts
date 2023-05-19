import { Alg } from "./algebras";
import { Types } from "./types";

export function createAction<T extends Types>(
  factory: (alg: Alg<T>) => T["Action"]
): (alg: Alg<T>) => T["Action"] {
  return factory;
}
