import { rxEvents } from "./GameDisplay";
import { LotrLCGClient } from "./bgio/LotrLCGBoard";
import { useSnackbar } from "notistack";
import { SetupParams } from "./App";

export const Game = (props: { setup: SetupParams }) => {
  const { enqueueSnackbar } = useSnackbar();

  const Client = LotrLCGClient(rxEvents, props.setup, {
    debug(...message) {
      console.log(...message);
    },
    log(m) {
      enqueueSnackbar(m);
    },
    success(m) {
      enqueueSnackbar(m, { variant: "success" });
    },
    warning(m) {
      enqueueSnackbar(m, { variant: "warning" });
    },
    error(m) {
      enqueueSnackbar(m, { variant: "error" });
    },
  });

  const playerID =
    props.setup.type === "join" ? props.setup.server.playerId : "0";

  console.log("playerID", playerID);

  return <Client playerID={playerID} />;
};
