import { Box } from '@mui/material';
import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import LogoStatic from '../src/assets/LogoStatic';
import Image from 'next/image';

export default function Mobile() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(() => false);
    }, 2000);
    return () => {
      clearTimeout();
      setLoading(() => true);
    };
  }, []);

  return (
    <React.Fragment>
      {
        loading ?
        <Backdrop
          sx={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: '#fff', zIndex: 5000, m: 'auto', display: 'flex', flexWrap: 'wrap' }}
          open={loading}
        >
          <Image
            width={670}
            height={670}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            src="/images/banners/E-Commerce_mobile.jpg"
            alt="E-Commerce_mobile banner"
            quality={85}
          />
        </Backdrop>
        :
        <Box sx={{ my: 4 }}>
          MObile
        </Box>

      }
    </React.Fragment>
  )
}
