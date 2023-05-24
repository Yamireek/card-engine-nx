import { Board, CardDisplay, NextStepButton } from "@card-engine-nx/ui";
import { CssBaseline } from "@mui/material";
import { HandLayout } from "libs/ui/src/lib/HandLayout";

const drawerWidth = 430;

export const App = () => {
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

      <Board perspective={1000} rotate={0} width={1608 * 3} height={1620 * 3} />

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
