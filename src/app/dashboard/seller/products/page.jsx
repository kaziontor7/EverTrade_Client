import { getUserSession } from "@/lib/core/session";
import { getProductsBySellerId } from "@/lib/api/products";
import ProductsTable from "./ProductsTable";

export default async function SellerProductsPage() {
  const session = await getUserSession();

  if (!session) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        Please log in to view your products.
      </div>
    );
  }

  let products = [];
  try {
    products = await getProductsBySellerId(session.id);
    if (!Array.isArray(products)) {
      products = [];
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your inventory, prices, and stock.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You don&apos;t have any active listings yet.</p>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
            <ProductsTable products={products} />
          </div>
        )}
      </div>
    </div>
  );
}
