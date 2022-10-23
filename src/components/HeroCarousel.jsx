import * as React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CardProduct from "./CardProduct";
import { IconButton } from "@mui/material";
import category from "../utils/category";
import Link from '../Link';

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

export default function HeroCarousel({ data }) {
  const { product } = data;
  const { category_products } = category;
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = category_products.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: "100%", flexGrow: 1 }}>
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
        {
          category_products.map((step, index) => (
            <TabPanel key={step.title} value={activeStep} index={index} dir={theme.direction}>
              <CardProduct products={product} step={step}/>
            </TabPanel>
          ))
        }
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
  );
}
