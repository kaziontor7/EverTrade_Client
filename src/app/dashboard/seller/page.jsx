import { getUserSession } from "@/lib/core/session";
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
      fetch(`${API_URL}/products?sellerId=${session.id}`),
      fetch(`${API_URL}/orders/seller/${session.id}`)
    ]);
    
    if (productsRes.ok) products = await productsRes.json();
    if (ordersRes.ok) orders = await ordersRes.json();
  } catch (error) {
    console.error("Failed to fetch seller dashboard data:", error);
  }

  const totalProducts = products.length;
  const totalSales = orders.filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'success').length;
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'success').reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0);
  const pendingOrders = orders.filter(o => !o.orderStatus || o.orderStatus === 'processing' || o.orderStatus === 'pending').length;

  const stats = [
    { title: "Total Products", value: totalProducts.toString(), icon: "inventory_2", color: "from-blue-500/20 to-blue-500/5", text: "text-blue-500" },
    { title: "Total Sales", value: totalSales.toString(), icon: "shopping_cart", color: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-500" },
    { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: "account_balance_wallet", color: "from-purple-500/20 to-purple-500/5", text: "text-purple-500" },
    { title: "Pending Orders", value: pendingOrders.toString(), icon: "pending_actions", color: "from-amber-500/20 to-amber-500/5", text: "text-amber-500" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, {session.name}. Here's what's happening with your store today.</p>
        </div>
        <Link 
          href="/dashboard/seller/add-product"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap"
        >
          Add New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40`}>
            <div className="flex justify-between items-start">
              <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.title}</p>
              <span className={`material-symbols-outlined ${stat.text}`}>{stat.icon}</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
          </div>
        ))}
      </div>
      
      {/* Additional overview content can go here later */}
    </div>
  );
}
