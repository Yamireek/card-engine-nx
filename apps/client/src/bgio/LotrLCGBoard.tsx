import {
  Logger,
  LotrLCGame,
  ObservableContext,
  UIEvents,
  beginScenario,
  createView,
  getActions,
  nullLogger,
} from "@card-engine-nx/engine";
import { State, createState } from "@card-engine-nx/state";
import { BoardProps, Client } from "boardgame.io/react";
import { StateContext } from "../StateContext";
import { useEffect, useMemo } from "react";
import { validPlayerId } from "@card-engine-nx/basic";
import { Debug } from "boardgame.io/debug";
import { SetupParams } from "../App";
import { core, decks } from "@card-engine-nx/cards";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { DetailProvider } from "../DetailContext";
import { GameDisplay } from "../GameDisplay";

export type LotrLCGProps = BoardProps<State>;

export type Random = {
  shuffle: <T>(items: T[]) => T[];
  item: <T>(items: T[]) => T;
};

export function getRandomItem<T>(rnd: () => number) {
  return (items: T[]): T => {
    const index = Math.floor(rnd() * items.length);
    return items[index];
  };
}

export function shuffleItems<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }
}

export function rndJS(): Random {
  return {
    item<T>(items: T[]) {
      return getRandomItem<T>(Math.random)(items);
    },
    shuffle<T>(items: T[]) {
      shuffleItems(items);
      return items;
    },
  };
}

export const LotrLCGBoard = (props: LotrLCGProps) => {
  const view = useMemo(() => createView(props.G), [props.G]);
  const actions = useMemo(() => getActions(props.G, view), [props.G, view]);

  useEffect(() => {
    const value = localStorage.getItem("saved_state");
    if (!value) {
      return;
    }
    try {
      const loaded = JSON.parse(value);
      props.moves.load(loaded);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StateContext.Provider
      value={{
        state: props.G,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moves: props.moves as any,
        view,
        playerId:
          props.isMultiplayer && props.playerID
            ? validPlayerId(props.playerID)
            : undefined,
        undo: props.undo,
        redo: props.redo,
        actions,
      }}
    >
      <DetailProvider>
        <GameDisplay />
      </DetailProvider>
    </StateContext.Provider>
  );
};

export function LotrLCGClient(
  events: UIEvents,
  setup: SetupParams,
  logger?: Logger
) {
  if (setup.type === "load") {
    return Client({
      game: LotrLCGame(events, logger, JSON.parse(setup.state)),
      board: LotrLCGBoard,
      numPlayers: 1,
      debug: { collapseOnLoad: true, impl: Debug },
    });
  }

  if (setup.type === "join") {
    return Client({
      game: LotrLCGame(events, logger),
      board: LotrLCGBoard,
      numPlayers: 1,
      multiplayer: SocketIO({ server: setup.server.url }),
      debug: { collapseOnLoad: true, impl: Debug },
    });
  }

  if (setup.type === "new") {
    const state = createState();

    state.next = [
      beginScenario({
        players: setup.players
          .filter((p, i) => i < Number(setup.playerCount))
          .map((key) => decks[key]),
        scenario: core.scenario[setup.scenario],
        difficulty: setup.difficulty,
        extra: setup.extra,
      }),
    ];

    const ctx = new ObservableContext(
      state,
      events,
      rndJS(),
      nullLogger,
      false
    );

    ctx.advance({ actions: false, show: false }, true);

    return Client({
      game: LotrLCGame(events, logger, state),
      board: LotrLCGBoard,
      numPlayers:
        setup.server && setup.server !== "local"
          ? Number(setup.playerCount)
          : 1,
      multiplayer:
        setup.server === "local"
          ? Local({ persist: true })
          : setup.server
          ? SocketIO({ server: setup.server.url })
          : undefined,
      debug: { collapseOnLoad: true, impl: Debug },
    });
  }

  throw new Error("not implemented");
}
