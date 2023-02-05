import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Divider, IconButton, useMediaQuery } from "@mui/material";
import Link from '../Link';
import dynamic from 'next/dynamic';
import { useState } from "react";
import WidgetCardProduct from "./WidgetCardProduct";
import SwipeableViews from "react-swipeable-views";

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

function WidgetCarousel({ data }) {
  const { topProducts} = data;
  const [carouselProduct, setCarouselProduct] = useState([]);
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const singleMaxSteps = carouselProduct && carouselProduct.length;
  const [stopSwipe, setStopSwipe] = useState(false);
  const matches = useMediaQuery('(min-width: 900px)');

  const desktop = useMediaQuery('(min-width: 1440px)');
  const laptop = useMediaQuery('(min-width: 1200px)');
  const tablet = useMediaQuery('(min-width: 500px)');
  const mobile = useMediaQuery('(max-width: 480px)');

  let cardsToShow;
  let cardsToMove;
  
  if(desktop) {
    cardsToShow = 6;
  }else if(laptop) {
    cardsToShow = 4;
  }else if(tablet) {
    cardsToShow = 2;
  }else if(mobile) {
    cardsToShow = 2;
  }

  const maxSteps = Math.ceil(carouselProduct.length / cardsToShow);
  cardsToMove = Math.floor(carouselProduct.length / cardsToShow);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await topProducts;
        setCarouselProduct(res)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [])
  
  
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
      <Box onMouseLeave={() => setStopSwipe(false)} onMouseEnter={() => setStopSwipe(true)} sx={{ maxWidth: "100%", flexGrow: 1, position: 'relative' }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 150,
            p: 3,
            bgcolor: "transparent"
          }}
        >
        <Box sx={{ maxWidth: "100%", width: '100%', flexGrow: 1, flexWrap: 'wrap', textAlign: 'center' }}>
          <Typography align="left" variant="p" component="h2">
            {topProducts[0].inWidget.replace(/-/g, ' ').replace(/^./, function(x){return x.toUpperCase()})}
          </Typography>
          <Box sx={{p: 0, pt: 1}}>
            <Divider />
          </Box>
        </Box>
        </Paper>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
        >
            {
                carouselProduct.slice(0, maxSteps).map((prod, index) => (
                  <TabPanel key={prod._id} value={activeStep} index={index} dir={theme.direction}>
                    <WidgetCardProduct loading cardsToShow={cardsToShow} products={carouselProduct} steps={activeStep} cardsToMove={cardsToMove} />
                  </TabPanel>
                ))
            }
        </SwipeableViews>
          <MobileStepper
            steps={maxSteps}
            variant="dots"
            position="static"
            activeStep={activeStep}
            sx={{ position: 'absolute', top: '45px', right: "15px", background: 'transparent', '& .MuiMobileStepper-dots': {display: 'none'} }}
            nextButton={
              <IconButton onClick={handleNext} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginLeft: 1}} aria-label="left" size="small" disabled={activeStep === maxSteps - 1}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </IconButton>
            }
            backButton={
              <IconButton onClick={handleBack} sx={{border: "thin solid", backgroundColor: theme.palette.primary.contrastText, '&:hover': {backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText}, marginRight: 1}} aria-label="right" size="small" disabled={activeStep === 0}>
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </IconButton>
            }
          />
      </Box>
  );
}

export default dynamic(() => Promise.resolve(WidgetCarousel), { ssr: true });