import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Link from '../Link';

const steps = [{ tab: 'Personal info', slug: 'personal-info' }, { tab: 'Addresses', slug: 'addresses' }, { tab: 'Shipping method', slug: 'shipping' }, { tab: 'Payment', slug: 'payment' }];

export default function CheckoutStepper({ activeStep = 0 }) {

  const handleStep = (step) => {
    activeStep = step;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step sx={{ '& a': { textDecoration: 'none' }}} key={step.tab}>
            <Link noLinkStyle={false} href={{ pathname: `/checkout/${step.slug}` }} passHref>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {step.tab}
              </StepButton>
            </Link>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
