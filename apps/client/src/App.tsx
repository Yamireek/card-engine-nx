import { CssBaseline } from "@mui/material";
import { Game } from "./Game";
import { useState } from "react";
import { GameSetupData } from "@card-engine-nx/engine";
import { GameSetupDialog } from "./GameSetupDialog";
import { SnackbarProvider } from "notistack";
import { Difficulty } from "@card-engine-nx/basic";
import { core, decks } from "@card-engine-nx/cards";

export type NewGameParams = {
  type: "new";
  server?: "local" | { url: string };
  playerCount: "1" | "2" | "3" | "4";
  players: Array<keyof typeof decks>;
  scenario: keyof typeof core.scenario;
  difficulty: Difficulty;
  extra: {
    resources: number;
    cards: number;
  };
};

export type LoadGameParams = {
  type: "load";
  state: string;
};

export type JoinGameParams = {
  type: "join";
  server: {
    url: string;
    playerId: "0" | "1" | "2" | "3";
  };
};

export type SetupParams = NewGameParams | LoadGameParams | JoinGameParams;

const savedState = localStorage.getItem("saved_state");

const setup: SetupParams = {
  type: "new",
  difficulty: "normal",
  extra: { cards: 0, resources: 0 },
  playerCount: "1",
  players: ["coreLore"],
  scenario: "passageThroughMirkwood",
};

export const App = () => {
  //const [setup, setSetup] = useState<GameSetupData | undefined>();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        padding: 0,
        margin: 0,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <CssBaseline />

      {/* {!setup && !savedState && <GameSetupDialog onSubmit={setSetup} />} */}

      {(setup || savedState) && (
        <SnackbarProvider>
          <Game setup={setup} />
        </SnackbarProvider>
      )}
    </div>
  );
};
