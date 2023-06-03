import { useContext } from "react";
import ProfileLayout from "../../src/components/ProfileLayout"
import WishTable from "../../src/components/WishTable"
import { Store } from "../../src/utils/Store";
import { Box, Typography } from "@mui/material";

export default function ProfileWishlist() {
  const { state } = useContext(Store);
  const { cart: { cartItems }, wishlist: {wishItems} } = state;

  if(wishItems.length === 0) {
    return (
      <ProfileLayout>
        <Box sx={{ flexGrow: 1, my: 4, '& a': {textDecoration: 'none'} }}>
          <Typography gutterBottom variant="h6" component="h3" textAlign="center">
            There are no items in your wishlist
          </Typography>
        </Box>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout>
      <WishTable wishItems={wishItems} cartItems={cartItems} />
    </ProfileLayout>
  )
}