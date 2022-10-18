import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Grid } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Box } from '@mui/system';
import Link from '../Link';

export default function CardProduct({products, step}) {
  return (
    <Grid container spacing={2}>
    {
      products.map(product => (
        product.inWidget === 'hero' && product.category === step.category &&
          <Grid key={product.title} item xs={12} md={4}>
              <Card sx={{ width: "100%", height: "100%" }}>
                  <CardActionArea>
                    <Link href={`/product/${product.slug}`}>
                      <CardMedia
                        component="img"
                        width="auto"
                        height="168px"
                        image={product.images[0].image}
                        alt={product.title}
                        sx={{margin: 'auto', objectFit: 'contain'}}
                      />
                    </Link>
                    <CardContent>
                      {
                        product.inStock > 0 ? 
                       ( <Typography color="primary" gutterBottom variant="caption" component="p" textAlign="center">
                        Na stanju
                        </Typography>) :
                       ( <Typography color="secondary" gutterBottom variant="caption" component="p" textAlign="center">
                        nije na stanju
                        </Typography>)
                      }
                      <Typography gutterBottom variant="h6" component="h3" textAlign="center">
                      {product.title}
                      </Typography>
                      <Typography textAlign="center" variant="body2" color="text.secondary">
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
                      <Typography textAlign="center" component="h3" variant="h6" color="secondary">
                        {product.price}
                        <Typography textAlign="rigth" component="span" variant="body2" color="secondary.lightGrey" sx={{marginLeft: 1}}>
                          <del>{product.oldPrice && product.oldPrice}</del>
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
