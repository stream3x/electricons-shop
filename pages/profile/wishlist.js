import { useContext } from "react";
import ProfileLayout from "../../src/components/ProfileLayout"
import WishTable from "../../src/components/WishTable"
import { Store } from "../../src/utils/Store";
import BreadcrumbNav from "../../src/assets/BreadcrumbNav";
import styled from "@emotion/styled";
import { Paper, Typography } from "@mui/material";
import theme from '../../src/theme';
import ReplyIcon from '@mui/icons-material/Reply';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  }));

export default function ProfileWishlist() {
  const { state } = useContext(Store);
  const { cart: { cartItems }, wishlist: {wishItems} } = state;

  if(wishItems.length === 0) {
    return (
      <ProfileLayout>
        <Item sx={{ '& a': {textDecoration: 'none' } }} elevation={0}>
          <BreadcrumbNav />
          <Typography component="p" variant="h6">There are no items in your wishlist</Typography>
        </Item>
      </ProfileLayout>
    )
  }

  return (
    <ProfileLayout>
      <BreadcrumbNav />
      <WishTable wishItems={wishItems} cartItems={cartItems} />
    </ProfileLayout>
  )
}