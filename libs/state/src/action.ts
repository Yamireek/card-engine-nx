import { Alg, Types } from "@card-engine-nx/algebras";

export type Action = <T extends Types>(alg: Alg<T>) => T["Action"];
