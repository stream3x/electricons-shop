import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Link from '../Link';
import { StepLabel, useMediaQuery } from '@mui/material';
import { Store } from '../utils/Store';
import InfoIcon from '@mui/icons-material/Info';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styled from '@emotion/styled';
import theme from '../theme';

const QontoStepIconRoot = styled('div')(({ ownerState }) => ({
  color: theme.palette.mode === 'dark' ? '#eaeaf0' : '#eaeaf0',
  display: 'flex',
  height: 22,
  fontSize: 12,
  alignItems: 'center',
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  '& .QontoStepIcon-completedIcon': {
    color: theme.palette.primary.main,
    zIndex: 1,
    fontSize: 12,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed } = props;

  const icons = {
    1: <InfoIcon />,
    2: <ImportContactsIcon />,
    3: <LocalShippingIcon />,
    4: <PaymentIcon />,
    5: <ShoppingCartIcon />,
  };

  return (
    <QontoStepIconRoot ownerState={{ completed, active }}>
      {icons[String(props.icon)]}
    </QontoStepIconRoot>
  );
}

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
      {
        match ?
        <Stepper alternativeLabel activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={step.tab}>
              <Link noLinkStyle={false} href={{ pathname: `/checkout/${step.slug}` }} passHref>
                <StepButton sx={{'& span': {fontSize: '10px'}}} color="inherit" onClick={handleStep(index)}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{step.tab}</StepLabel>
                </StepButton>
              </Link>
            </Step>
          ))}
        </Stepper>
        :
        <Stepper sx={{ mx: {xs: 5, sm: 0} }} activeStep={activeStep} orientation="horizontal">
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
      }
    </Box>
  );
}
