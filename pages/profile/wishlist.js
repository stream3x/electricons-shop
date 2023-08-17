import { useContext } from "react";
import ProfileLayout from "../../src/components/ProfileLayout"
import WishTable from "../../src/components/WishTable"
import { Store } from "../../src/utils/Store";
import BreadcrumbNav from "../../src/assets/BreadcrumbNav";

export default function ProfileWishlist() {
  const { state } = useContext(Store);
  const { cart: { cartItems }, wishlist: {wishItems} } = state;

  return (
    <ProfileLayout>
      <BreadcrumbNav />
      <WishTable wishItems={wishItems} cartItems={cartItems} />
    </ProfileLayout>
  )
}