import { getProducts } from '@/lib/api/products';
import { getWishList } from '@/lib/api/wishlist';
import { getUserSession } from '@/lib/session';
import HomeClient from './HomeClient';

export default async function Home() {
  let featuredProducts = [];
  try {
    const data = await getProducts({ limit: 4 });
    if (data && data.products) {
      featuredProducts = data.products;
    } else if (Array.isArray(data)) {
      const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      featuredProducts = sorted.slice(0, 4);
    }
  } catch (error) {
    console.error(error);
  }

  const user = await getUserSession();
  let wishList = [];
  
  if (user && user.id) {
    try {
      wishList = await getWishList(user.id);
    } catch (err) {
      console.error(err);
    }
  }

  return <HomeClient initialFeaturedProducts={featuredProducts} initialWishList={wishList} user={user} />;
}
