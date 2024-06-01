
 //string
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';
import { CSSProperties } from 'react';
import { PlayerId } from '@card-engine-nx/basic';

type GameInfoProps = {
  showPlayer?: PlayerId;
  threat: number;
  willpower: number;
  progress: {
    current: number;
    target: number;
  };
  players: Array<{
    id: PlayerId;
    threat: number;
    state: 'active' | 'passed' | 'waiting' | 'eliminated';
  }>;
};

export const GameInfo = (props: GameInfoProps) => {
  return (
    <TableContainer component={Paper} sx={{ opacity: 0.75, flexShrink: 0 }}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>Threat</TableCell>
            <TableCell>{props.threat}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Willpower</TableCell>
            <TableCell>{props.willpower}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Progress</TableCell>
            <TableCell>
              {props.progress.current} / {props.progress.target}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Threat</TableCell>
            <TableCell>State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.players.map((player, index) => {
            const eliminated = player.state === 'eliminated';
            const style: CSSProperties = {
              color: eliminated ? 'grey' : undefined,
              background:
                player.id === props.showPlayer
                  ? 'rgba(0, 128, 0, 0.25)'
                  : undefined,
            };
            return (
              <TableRow
                key={index}
                style={{
                  textDecoration: eliminated ? 'line-through' : undefined,
                }}
              >
                <TableCell style={style}>{player.id}</TableCell>
                <TableCell style={style}>{player.threat}</TableCell>
                <TableCell style={style}>{player.state}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
