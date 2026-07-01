import { getUserSession } from "@/lib/core/session";
import { protectedFetch } from "@/lib/core/server";
import Link from "next/link";

export default async function SellerDashboard() {
  const session = await getUserSession();
  
  if (!session) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        Please log in to view your dashboard.
      </div>
    );
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  let products = [];
  let orders = [];
  
  try {
    const [productsRes, ordersRes] = await Promise.all([
      protectedFetch(`products?sellerId=${session.id}`),
      protectedFetch(`orders/seller/${session.id}`)
    ]);
    
    if (productsRes) {
      products = Array.isArray(productsRes) ? productsRes : (productsRes.products || []);
    }
    if (ordersRes) {
      orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.orders || []);
    }
  } catch (error) {
    console.error("Failed to fetch seller dashboard data:", error);
  }

  const totalProducts = products.length;
  const totalSales = orders.filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'success').length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'success').reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0);
  const pendingOrders = orders.filter(o => !o.orderStatus || o.orderStatus === 'processing' || o.orderStatus === 'pending').length;

  const stats = [
    { title: "Total Products", value: totalProducts.toString(), icon: "inventory_2" },
    { title: "Total Sales", value: totalSales.toString(), icon: "shopping_cart" },
    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: "account_balance_wallet" },
    { title: "Pending Orders", value: pendingOrders.toString(), icon: "pending_actions" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-start md:items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">
            Dashboard Overview
          </h1>
          <p className="text-zinc-500 font-medium mt-2 text-lg">Welcome back, {session.name}. Here's what's happening with your store today.</p>
        </div>
        <Link 
          href="/dashboard/seller/add-product"
          className="px-6 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          Add New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 dark:bg-white rounded-2xl p-6 flex flex-col justify-between h-40 shadow-brutal">
            <div className="flex justify-between items-start">
              <p className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider text-xs">{stat.title}</p>
              <div className="w-10 h-10 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-4xl font-black text-white dark:text-zinc-900 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-12 mt-4">
        
        {/* Recent Orders Monitor */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Recent Orders</h2>
              <p className="text-sm text-zinc-500 mt-1">Latest transactions from your store.</p>
            </div>
            <Link href="/dashboard/seller/orders" className="text-sm font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 px-4 whitespace-nowrap">Order ID</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Amount</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="py-4 px-4 font-mono text-sm text-zinc-600 dark:text-zinc-400">#{order._id.substring(0, 8)}...</td>
                    <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">${order.price?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                        order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' :
                        ['cancelled', 'declined', 'canceled'].includes(order.orderStatus?.toLowerCase()) ? 'bg-transparent text-zinc-400 border-zinc-200 border-dashed dark:border-zinc-800 line-through' :
                        'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-zinc-500">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products Monitor */}
        <div className="pt-2">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Recent Listings</h2>
              <p className="text-sm text-zinc-500 mt-1">Your newest products on the marketplace.</p>
            </div>
            <Link href="/dashboard/seller/products" className="text-sm font-bold text-zinc-900 dark:text-white hover:underline underline-offset-4">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 px-4 whitespace-nowrap">Product</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Price</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {products.slice(0, 5).map(product => (
                  <tr key={product._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white">{product.title}</td>
                    <td className="py-4 px-4 font-medium">${product.price?.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                        product.moderationStatus === 'approved' ? 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' :
                        product.moderationStatus === 'rejected' ? 'bg-transparent text-zinc-400 border-zinc-200 border-dashed dark:border-zinc-800 line-through' :
                        'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800'
                      }`}>
                        {product.moderationStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-zinc-500">No products yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
