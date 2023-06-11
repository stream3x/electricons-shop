import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import theme from '../../src/theme'
import Image from 'next/image'
import Link from '../../src/Link';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

const blogs = [
  {id: '2.1', images: '/images/amd_desktop/amd-desktop-ryzen.png', title: 'What desktop computer shuld use for graphic desing', link: '/amd-ryzen-gamer-desktop', category: 'amd-desktop', shortDescription: "Ryzen 5 | 3.6 GHz | Chipset B450 | RAM 16 GB | SSD 500 GB | Nvidia RTX 3050 8GB GDDR6"},
  {id: '2.2', images: '/images/acer_desktop/acer_desktop.png',  title: 'Legal Notice', link: '#', category: 'amd-desktop', shortDescription: "Ryzen 5 | 3.6 GHz | Chipset B450 | RAM 16 GB | SSD 500 GB | Nvidia RTX 3050 8GB GDDR6"},
  {id: '2.3', images: '/images/acer_desktop/amd-acer-desktop.png',  title: 'Terms and conditions of use', link: '#', category: 'amd-desktop', shortDescription: "Ryzen 5 | 3.6 GHz | Chipset B450 | RAM 16 GB | SSD 500 GB | Nvidia RTX 3050 8GB GDDR6"},
  {id: '2.4', images: '/images/dell_desktop/dell_desktop.png',  title: 'About us', link: '#', category: 'amd-desktop', shortDescription: "Ryzen 5 | 3.6 GHz | Chipset B450 | RAM 16 GB | SSD 500 GB | Nvidia RTX 3050 8GB GDDR6"},
  {id: '2.5', images: '/images/hp_desktop/hp-desktop.png',  title: 'Contact us', link: '#', category: 'amd-desktop', shortDescription: "Ryzen 5 | 3.6 GHz | Chipset B450 | RAM 16 GB | SSD 500 GB | Nvidia RTX 3050 8GB GDDR6"},
];

const LabelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textTransform: 'capitalize',
  backgroundColor: theme.palette.default,
  border: 'thin solid lightGrey',
  borderLeft: '3px solid black',
  marginLeft: '10px',
}));

export default function BlogPages() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{height: '600px'}}>
        <Box sx={{ bgcolor: theme.palette.primary.main, position: 'absolute', width: '100%', left: '-50%', marginLeft: '50%', marginTop: '-3rem', py: '4rem', px: '1.5rem', height: '500px' }}>
          <Container maxWidth="xl">
            <Box sx={{display: 'flex'}}>
              <Box sx={{ position: 'relative', width: '500px', height: '500px'}}>
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  src='/images/amd_desktop/desktop_ryzen.png'
                  alt="amd desktop"
                  quality={75}
                  loading="eager"
                />
              </Box>
              <Box sx={{flexGrow: 1, my: 'auto', ml: '8rem'}}>
                <Typography component="p" variant="h6" color={theme.palette.primary.contrastText}>Gaming 4K*</Typography>
                <Typography component="h1" variant="h2" color={theme.palette.primary.contrastText} sx={{fontWeight: 'bolder'}}>Desktops Computer</Typography>
                <Typography sx={{pt: '2rem'}} component="p" variant="h6">#GamingTechMarket</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
      <Box component="section" sx={{py: 3, mb: 5, display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
        <Typography sx={{width: '100%', textAlign: 'center', p: 3}} component="h2" variant='h4'>Categories</Typography>
        <Link href={`/blog/gaming-desktop`}>
          <LabelButton sx={{width: { xs: '100%', sm: 'auto'}, my: .5}}>
            Gaming Desktop Computer
          </LabelButton>
        </Link>
      </Box>
      <Box component="section">
        <Container maxWidth="xl">
          <Grid container spacing={0}>
            {
              blogs.map(prod => (
                <Grid sx={{display: {xs: 'none', md: 'block'}}} key={prod.id} item xs={12}>
                    <Card sx={{ width: "100%", height: "100%", display: 'flex', boxShadow: 'none!important' }}>
                        <CardActionArea sx={{position: 'relative', width: '100%', display: 'flex', '& a': { width: '100%'} }}>
                          <Link sx={{position: 'relative', display: 'flex', flex: 0}} href={`/post/${prod.link}`}>
                            <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%','& img': {objectFit: 'contain', width: 'unset!important', height: '168px!important', position: 'relative!important', p: 2} }} component="div">
                              <Image
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                src={prod.images}
                                alt={prod.title}
                                quality={35}
                              />
                            </CardMedia>
                          </Link>
                          <CardContent sx={{display: 'flex', flex: '0 0 75%', flexWrap: 'wrap'}}>
                            <Typography sx={{width: '100%'}} gutterBottom variant="h6" component="h3" align="left">
                            {prod.title}
                            </Typography>
                            <Typography align="center" variant="body2" color="text.secondary">
                              {prod.shortDescription}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
              ))
            }
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
