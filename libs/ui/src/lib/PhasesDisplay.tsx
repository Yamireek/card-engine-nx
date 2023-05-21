import { Phase } from '@card-engine-nx/basic';
import { Stepper, Step, StepLabel } from '@mui/material';
import { indexOf } from 'lodash';

const phases: Phase[] = [
  'resource',
  'planning',
  'quest',
  'travel',
  'encounter',
  'combat',
  'refresh',
];

export const PhasesDisplay = (props: { phase: Phase }) => {
  return (
    <Stepper activeStep={indexOf(phases, props.phase)} orientation="vertical">
      {phases.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
