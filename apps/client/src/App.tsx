import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { useMemo } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { LobbyPage } from './bgio/LobbyPage';
import { CollectionPage } from './collection/CollectionPage';
import { DialogProvider } from './dialogs/DialogsContext';
import { GamePage } from './game/GamePage';
import { MenuPage } from './game/MenuPage';
import { SingleSetupPage } from './game/SingleSetupPage';
import { SettingsPage } from './settings/SettingsPage';

export const App = () => {
  const router = useMemo(
    () =>
      createHashRouter([
        {
          path: '/',
          element: (
            <MenuPage
              items={[
                { label: 'Singleplayer', link: '/#/single', icon: 'person' },
                { label: 'Multiplayer', link: '/#/lobby', icon: 'group' },
                {
                  label: 'Collection',
                  link: '/#/collection',
                  icon: 'collections',
                },
                { label: 'Settings', link: '/#/settings', icon: 'settings' },
              ]}
            />
          ),
        },
        {
          path: '/single',
          element: <SingleSetupPage />,
        },
        { path: '/lobby', element: <LobbyPage /> },
        { path: '/game', element: <GamePage /> },
        {
          path: '/collection',
          element: <CollectionPage />,
        },
        { path: '/settings', element: <SettingsPage /> },
      ]),
    []
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        userSelect: 'none',
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
