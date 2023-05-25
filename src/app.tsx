import { Board, createBoardModel, getCardImageUrl } from "@card-engine-nx/ui";
import { CssBaseline } from "@mui/material";
import { useMemo } from "react";
import { GameEngine, advanceToChoiceState } from "./tests/GameEngine";
import { coreTactics } from "./decks/coreTactics";
import { addCard } from "./tests/addPlayer";
import { executeAction } from "@card-engine-nx/engine";
import {
  CardModel,
  DeckModel,
  FloatingCardModel,
  ZoneModel,
  cardSize,
} from "@card-engine-nx/store";
import { Test } from "./Test";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawerWidth = 430;

export const App = () => {
  const result = useMemo(() => {
    const engine = new GameEngine();
    engine.addPlayer();

    for (const hero of coreTactics.heroes) {
      engine.addHero(hero);
    }

    for (const card of coreTactics.library) {
      addCard(card, "back", { type: "library", owner: "A" }).execute(
        engine.state
      );
    }

    window["state"] = engine.state;

    return { board: createBoardModel(engine.state), engine };
  }, []);

  const board = result.board;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      <Test />

      {/* <Board
        perspective={1000}
        rotate={0}
        width={1608 * 3}
        height={1620 * 3}
        model={result.board}
      /> */}

      {/* <div style={{ position: 'absolute', top: 0 }}>
        <CardDisplay
          height={600}
          image={cardImages[0]}
          orientation="portrait"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -100,
          width: '100%',
        }}
      >
        <HandLayout cardImages={cardImages} cardWidth={200} rotate={2} />
      </div>

      */}
      {/* <NextStepButton
        title="Next step"
        onClick={() => {
          console.log('next');
        }}
      /> */}
    </div>
  );
};
