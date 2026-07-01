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
    const res = await getProductsBySellerId(session.id);
    if (res) {
      products = Array.isArray(res) ? res : (res.products || []);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-w-0">
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">My Products</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your inventory, prices, and stock.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">You don't have any active listings yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <ProductsTable products={products} />
          </div>
        )}
      </div>
    </div>
  );
}
