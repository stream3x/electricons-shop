import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid, useMediaQuery } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Box } from '@mui/system';
import Link from '../Link';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import ActionCardButtons from '../assets/ActionCardButtons';

export default function WidgetCardProduct(props) {
  const { products, steps, cardsToShow, cardsInView } = props;
  const [selected, setSelected] = React.useState('');
  const mobile = useMediaQuery('(max-width: 450px)');

  const handleLoading = (product) => {
    setSelected(product._id);
  };

  return (
    <Grid container spacing={2} sx={{py: '.5rem'}}>
    {
      cardsToShow !== 2 ?
      products.slice(steps * (products.length - cardsToShow), steps === 0 ? cardsToShow : (products.length * steps)).map((product, index) => (
          <Grid key={product.title} item xs={cardsInView}>
              <Card elevation={0} sx={{ width: "100%", height: "100%", '&:hover .hover-buttons': {opacity: 1, transform: 'translateX(0px)', transition: 'all .5s'} }}>
                  <CardActionArea sx={{position: 'relative'}}>
                    <Link href={`/product/${product.slug}`} onClick={() => handleLoading(product)}>
                    {
                      product._id === selected &&
                      <CircularProgress sx={{position: 'absolute', left: '45%', top: '20%', zIndex: 1, transform: 'translateX(-50%)'}} size={50} />
                    }
                      <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', '& img': {objectFit: 'contain', width: 'unset!important', height: '168px!important', position: 'relative!important', p: 2} }} component="div">
                        <Image
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          src={product.images && product.images[1].image}
                          alt={product.title}
                          quality={35}
                        />
                      </CardMedia>
                    </Link>
                    <Box className='hover-buttons' sx={{opacity: {xs: 1, sm: 0}, transform: {xs: 'translateX(0px)', sm: 'translateX(-200px)'}}}>
                        <ActionCardButtons product={product} view={"module"} />
                    </Box>
                    <CardContent>
                      {
                        product.inStock > 0 ? 
                        ( <Typography color="primary" gutterBottom variant="caption" component="p" align="center">
                        in Stock
                        </Typography>) :
                        ( <Typography color="secondary" gutterBottom variant="caption" component="p" align="center">
                        out of Stock
                        </Typography>)
                      }
                      <Typography gutterBottom variant="h6" component="h3" align="center">
                      {product.title}
                      </Typography>
                      <Typography align="center" variant="body2" color="text.secondary">
                        {product.shortDescription}
                      </Typography>
                      <Box
                        sx={{
                          textAlign: 'center',
                          my: 1,
                        }}
                        >
                        <Rating size="small" name="read-only" value={product.rating} readOnly precision={0.5} />
                      </Box>
                      <Typography align="center" component="h3" variant="h6" color="secondary">
                      {'$'}{product.price}
                        <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                          <del>
                          {'$'}{product.oldPrice && product.oldPrice}
                          </del>
                        </Typography>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
              </Card>
          </Grid>
          ))
          :
          products.slice(steps * (cardsToShow), (cardsToShow * (steps + 1))).map((product, index) => (
            <Grid key={product.title} item xs={6}>
                <Card sx={{ width: "100%", height: "100%" }}>
                    <CardActionArea sx={{position: 'relative'}}>
                      <Link href={`/product/${product.slug}`} onClick={() => handleLoading(product)}>
                      {
                        product._id === selected &&
                        <CircularProgress sx={{position: 'absolute', left: '45%', top: '20%', zIndex: 1, transform: 'translateX(-50%)'}} size={50} />
                      }
                        <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','& img': {objectFit: 'contain', width: 'unset!important', height: '168px!important', position: 'relative!important', p: 2} }} component="div">
                          <Image
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            src={product.images && product.images[1].image}
                            alt={product.title}
                            quality={35}
                          />
                        </CardMedia>
                      </Link>
                      <Box className='hover-buttons' sx={{opacity: {xs: 1, sm: 0}, transform: {xs: 'translateX(0px)', sm: 'translateX(-200px)'}}}>
                        <ActionCardButtons product={product} view={"module"} />
                      </Box>
                      <CardContent>
                        {
                          product.inStock > 0 ? 
                          ( <Typography color="primary" gutterBottom variant="caption" component="p" align="center">
                          in Stock
                          </Typography>) :
                          ( <Typography color="secondary" gutterBottom variant="caption" component="p" align="center">
                          out of Stock
                          </Typography>)
                        }
                        <Typography gutterBottom variant="h6" component="h3" align="center">
                        {product.title}
                        </Typography>
                        <Typography align="center" variant="body2" color="text.secondary">
                        {mobile ? product.shortDescription.slice(0, 45) : product.shortDescription}
                        </Typography>
                        <Box
                          sx={{
                            textAlign: 'center',
                            my: 1,
                          }}
                          >
                          <Rating size="small" name="read-only" value={product.rating} readOnly precision={0.5} />
                        </Box>
                        <Typography align="center" component="h3" variant="h6" color="secondary">
                        {'$'}{product.price}
                          <Typography align="right" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                            <del>
                            {'$'}{product.oldPrice && product.oldPrice}
                            </del>
                          </Typography>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            ))
        }
    </Grid>
  );
}
