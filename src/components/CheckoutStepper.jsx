import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Link from '../Link';
import { useMediaQuery } from '@mui/material';
import { Store } from '../utils/Store';

const steps = [{ tab: 'Personal info', slug: 'personal-info' }, { tab: 'Addresses', slug: 'addresses' }, { tab: 'Shipping', slug: 'shipping' }, { tab: 'Payment', slug: 'payment' }, { tab: 'Place Order', slug: 'placeorder' }];

export default function CheckoutStepper({ activeStep = 0 }) {
  const match = useMediaQuery('(max-width: 600px)');
  const { state } = useContext(Store);
  const { userInfo } = state;

  const handleStep = (step) => {
    activeStep = step;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper sx={{ mx: {xs: 5, sm: 0} }} activeStep={activeStep} orientation={match ? "vertical" : "horizontal"}>
        {steps.map((step, index) => (
          <Step sx={{ '& a': { textDecoration: 'none' }}} key={step.tab}>
            <Link noLinkStyle={false} href={{ pathname: `/checkout/${step.slug}` }} passHref>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {userInfo && step.tab === 'Personal info' ? 'User info' : step.tab}
              </StepButton>
            </Link>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
