import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonalInfo from '../../pages/checkout/adresses';
import Addresses from '../../pages/checkout/adresses';
import Link from '../Link';

const steps = [{ tab: 'Personal info', slug: 'personal-info' }, { tab: 'Addresses', slug: 'addresses' }, { tab: 'Shipping method', slug: 'shipping' }, { tab: 'Payment', slug: 'payment' }];

export default function CheckoutStepper(props) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(prev => prev = newActiveStep);
    console.log('click', activeStep)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
console.log('state', activeStep)
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step sx={{ '& a': { textDecoration: 'none' }}} key={step.tab} completed={completed[index]}>
            <Link noLinkStyle={false} href={{ pathname: '/checkout', query: { step: step.slug } }} passHref>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {step.tab}
              </StepButton>
            </Link>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
          {activeStep !== steps.length &&
            <Box sx={{ width: '100%' }}>
              <Box>
              {
                steps[activeStep].tab === 'Personal info' &&
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>Personal Information</Typography>
                  <PersonalInfo />
                </React.Fragment>
              }
              </Box>
              <Box>
              {
                steps[activeStep].tab === 'Addresses' &&
                <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>Adresses</Typography>
                <Addresses />
                </React.Fragment>
              }
              </Box>
              <Box>
              {
                steps[activeStep].tab === 'Shipping method' &&
                <Typography sx={{ mt: 2, mb: 1 }}>Shipping method</Typography>
              }
              </Box>
              <Box>
              {
                steps[activeStep].tab === 'Payment' &&
                <Typography sx={{ mt: 2, mb: 1 }}>Payment</Typography>
              }
              </Box>
            </Box>
          }
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto', '& > a': { textDecoration: 'none' } }} />
                <Link sx={{ textDecoration: 'none' }} noLinkStyle={false} href={{ pathname: '/checkout', query: { step: steps[activeStep].slug } }} passHref>
                  <Button onClick={handleNext} sx={{ mr: 1 }}>
                    Next
                  </Button>
                </Link>
                {activeStep !== steps.length &&
                  completed[activeStep] ?
                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                      Step {activeStep + 1} already completed
                    </Typography>
                  : 
                  <Button onClick={handleComplete}>
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                }
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
