import { createHero } from "@card-engine-nx/algebras";

export const gimli = createHero(
  {
    name: "Gimli",
    threatCost: 11,
    willpower: 2,
    attack: 2,
    defense: 2,
    hitPoints: 5,
    traits: ["dwarf", "noble", "warrior"],
    sphere: "tactics",
  },
  (f) => [f.ability.ability1()]
);
