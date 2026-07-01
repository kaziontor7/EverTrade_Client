import { getProducts } from "@/lib/api/products";
import ProductsClient from "./ProductsClient";
import { getWishList } from "@/lib/api/wishlist";
import { getUserSession } from "@/lib/session";

export const metadata = {
  title: "Marketplace | Re Sell Hub",
  description: "Discover premium second-hand items",
};

export default async function ProductsPage({ searchParams }) {
  let initialData = { products: [], totalPages: 1 };
  
  // Await searchParams in Next.js 15+
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category || 'All';

  try {
    const data = await getProducts(category !== 'All' ? { category } : {});
    if (data && data.products) {
      initialData = data;
    } else if (Array.isArray(data)) {
      // Fallback if backend hasn't restarted yet
      initialData = { products: data, totalPages: 1 };
    }
  } catch (error) {
    console.error("Failed to fetch products on server:", error);
  }

  const user = await getUserSession();
  let wishList = [];
  
  if (user && user.id) {
    try {
      wishList = await getWishList(user.id);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }

  return (
    <ProductsClient initialData={initialData} wishList={wishList} user={user} initialCategory={category} />
  );
}
