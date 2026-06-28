import { getProducts } from "@/lib/api/products";
import ProductsClient from "./ProductsClient";
import { getWishList } from "@/lib/api/wishlist";
import { getUserSession } from "@/lib/session";

export const metadata = {
  title: "Marketplace | Re Sell Hub",
  description: "Discover premium second-hand items",
};

export default async function ProductsPage() {
  // Fetch products on the server side
  let initialProducts = [];

  try {
    const data = await getProducts();
    if (Array.isArray(data)) {
      initialProducts = data;
    }
  } catch (error) {
    console.error("Failed to fetch products on server:", error);
  }

  const user = await getUserSession();
  const wishList = await getWishList(user?.id);

  return (
    <ProductsClient initialProducts={initialProducts} wishList={wishList} user={user} />
  );
}
