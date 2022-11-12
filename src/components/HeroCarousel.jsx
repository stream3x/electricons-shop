import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CardProduct from "./CardProduct";
import { IconButton, useMediaQuery } from "@mui/material";
import category from "../utils/category";
import Link from '../Link';
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from 'react-swipeable-views-utils';
import dynamic from 'next/dynamic';
import { useState } from "react";
import SingleCardProduct from "./SingleCardProduct";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function HeroCarousel({ data }) {
  const { product } = data;
  const { category_products } = category;
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = category_products.length;
  const filtered = product.filter(obj => {
    return obj.inWidget === 'hero';
  });
  const singleMaxSteps = filtered.length;
  const [stopSwipe, setStopSwipe] = useState(false);
  const matches = useMediaQuery('(min-width: 900px)');
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <React.Fragment>
      {
        !matches ? 
        <Box onMouseLeave={() => setStopSwipe(false)} onMouseEnter={() => setStopSwipe(true)} sx={{ maxWidth: "100%", flexGrow: 1 }}>
          <AutoPlaySwipeableViews
            autoplay={stopSwipe ? false : true}
            interval={4000}
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {
              filtered.map((prod, index) => (
                Math.abs(activeStep - index) <= 2 &&
                <SingleCardProduct key={prod.title} product={prod} />
              ))
            }
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={singleMaxSteps}
            position="static"
            activeStep={activeStep}
            sx={{justifyContent: 'center'}}
            nextButton={
              <IconButton onClick={handleNext} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginLeft: 1}} aria-label="left" size="large" disabled={activeStep === singleMaxSteps - 1}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </IconButton>
            }
            backButton={
              <IconButton onClick={handleBack} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginRight: 1}} aria-label="right" size="large" disabled={activeStep === 0}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </IconButton>
            }
          />
        </Box> 
      : 
      <Box onMouseLeave={() => setStopSwipe(false)} onMouseEnter={() => setStopSwipe(true)} sx={{ maxWidth: "100%", flexGrow: 1 }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 50,
            pl: 2,
            bgcolor: "background.default"
          }}
        >
        <Box sx={{ maxWidth: "100%", width: '100%', flexGrow: 1, flexWrap: 'wrap', textAlign: 'center' }}>
        <Link href={category_products[activeStep].categoryUrl}>
          <Typography color="primary" variant="caption">
            {category_products[activeStep].title}
          </Typography>
        </Link>
          <Typography variant="h" component="h1">{category_products[activeStep].title}</Typography>
        </Box>
        </Paper>
        <AutoPlaySwipeableViews
          autoplay={stopSwipe ? false : true}
          interval={4000}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
        >
          {
            category_products.map((step, index) => (
              <TabPanel key={step.title} value={activeStep} index={index} dir={theme.direction}>
                <CardProduct products={product} step={step}/>
              </TabPanel>
            ))
          }
        </AutoPlaySwipeableViews>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{justifyContent: 'center'}}
          nextButton={
            <IconButton onClick={handleNext} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginLeft: 1}} aria-label="left" size="large" disabled={activeStep === maxSteps - 1}>
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>
          }
          backButton={
            <IconButton onClick={handleBack} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginRight: 1}} aria-label="right" size="large" disabled={activeStep === 0}>
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </IconButton>
          }
        />
      </Box>
      }
    </React.Fragment>
  );
}

export default dynamic(() => Promise.resolve(HeroCarousel), { ssr: true });