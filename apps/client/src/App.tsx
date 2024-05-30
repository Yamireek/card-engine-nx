import { CssBaseline } from "@mui/material";
import { Difficulty } from "@card-engine-nx/basic";
import { core, decks } from "@card-engine-nx/cards";
import { DialogProvider } from "./DialogsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { GamePage } from "./GamePage";
import { SingleSetupPage } from "./SingleSetupPage";
import { MenuPage } from "./MenuPage";
import { CollectionPage } from "./CollectionPage";
import { LobbyPage } from "./LobbyPage";

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
  server: string;
  playerID: string;
  matchID: string;
  credentials: string;
};

export type SetupParams = NewGameParams | LoadGameParams | JoinGameParams;

export const savedState = localStorage.getItem("saved_state");

export type ConnectionParams = {
  playerID: string;
  matchID: string;
  credentials: string;
};

const router = createHashRouter([
  {
    path: "/",
    element: (
      <MenuPage
        items={[
          { label: "Singleplayer", link: "/#/single", icon: "person" },
          { label: "Multiplayer", link: "/#/lobby", icon: "group" },
          { label: "Collection", link: "/#/collection", icon: "collections" },
        ]}
      />
    ),
  },
  {
    path: "/single",
    element: <SingleSetupPage />,
  },
  { path: "/lobby", element: <LobbyPage /> },
  { path: "/game", element: <GamePage /> },
  { path: "/collection", element: <CollectionPage /> },
]);

export const App = () => {
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
      <DialogProvider>
        <QueryClientProvider client={new QueryClient()}>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </QueryClientProvider>
      </DialogProvider>
    </div>
  );
};
