import { Box, Button, Typography } from "@mui/material";
import Link from "../src/Link";

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

export default function Error() {
  const status = getInitialProps();

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Typography sx={{p: 4}} variant="h3" component="h1" gutterBottom>
        {status.statusCode} | {statusCodes[status.statusCode]}
      </Typography>
      <Link href="/">
        <Button size="large" variant="contained" startIcon={<ReplyIcon />}>
          back to shop
        </Button>
      </Link>
    </Box>    
  )
}