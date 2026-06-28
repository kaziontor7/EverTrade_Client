import { getWishList } from "@/lib/api/wishlist";
import { getUserSession } from "@/lib/session";
import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "My Wishlist | Re Sell Hub",
  description: "Manage your saved items",
};

export default async function WishlistPage() {
  const user = await getUserSession();

  // Fetch actual wishlist data for the logged-in user
  let wishList = [];
  if (user?.id) {
    try {
      wishList = await getWishList(user.id);
    } catch (error) {
      console.error("Error fetching wishlist on server:", error);
    }
  }

  return <WishlistClient wishList={wishList} user={user} />;
}
