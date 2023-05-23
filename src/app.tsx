import { Board, CardDisplay, NextStepButton, Point3D } from '@card-engine-nx/ui';
import { CssBaseline } from '@mui/material';
import { HandLayout } from 'libs/ui/src/lib/HandLayout';
import { cardImages } from 'libs/ui/src/lib/HandLayout.stories';
import boardImage from './../libs/ui/src/images/board.jpg';
import { useEffect, useState } from 'react';
import { Deck3DProps, Deck3D } from './Deck3D';
import { Card3DProps, Card3D } from '../libs/ui/src/lib/3d/Card3D';

const drawerWidth = 430;

export const App = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      <CssBaseline />

      <Board perspective={1000} rotate={15} />

      <div style={{ position: 'absolute', top: 0 }}>
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

      <NextStepButton
        title="Next step"
        onClick={() => {
          console.log('next');
        }}
      />
    </div>
  );
};
