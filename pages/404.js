import { Box, Button, Typography } from "@mui/material";
import Link from "../src/Link";
import ReplyIcon from '@mui/icons-material/Reply';
import { useRouter } from "next/router";
import { useState } from "react";
import theme from '../src/theme';

const statusCodes = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error'
};

function getInitialProps( req, res) {
  const statusCode = req && req.statusCode ? req.statusCode : res ? err.statusCode : 404;
  return {
    statusCode
  };
}

export default function Custom404() {
  const status = getInitialProps();
  const router = useRouter();
  const [backPath, setBackPath] = useState('/');

  const handleBackPath = () => {
    setBackPath(router.push('/'))
  }

  return (
      <Box sx={{ my: 4, textAlign: 'center', '& a': {textDecoration: 'none' }, '&:hover a': {textDecoration: 'none' } }}>
        <Typography sx={{p: 4}} variant="h3" component="h1" gutterBottom>
          {status.statusCode} | {statusCodes[status.statusCode]}
        </Typography>
        <Link href={backPath} passHref>
          <Button sx={{'&:hover': {backgroundColor: theme.palette.secondary.main}}} onClick={handleBackPath} size="large" variant="contained" startIcon={<ReplyIcon />}>
            back to shop
          </Button>
        </Link>
      </Box>    
  )
}