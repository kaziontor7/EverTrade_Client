"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { getSellerOrders } from "@/lib/api/orders";

const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#e4e4e7'];

export default function SalesAnalyticsPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;
      try {
        const data = await getSellerOrders(session.user.id);
        if (data) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch seller orders for analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [session]);

  const { totalRevenue, totalOrders, statusData, revenueData, topProducts } = useMemo(() => {
    let revenue = 0;
    const statusCounts = {};
    const revenueByDate = {};
    const productSales = {};

    orders.forEach(order => {
      const amount = order.price * (order.quantity || 1);
      revenue += amount;

      // Status aggregation
      statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;

      // Revenue by Date
      const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      revenueByDate[date] = (revenueByDate[date] || 0) + amount;

      // Top Products
      if (!productSales[order.title]) {
        productSales[order.title] = { name: order.title, sales: 0, revenue: 0 };
      }
      productSales[order.title].sales += (order.quantity || 1);
      productSales[order.title].revenue += amount;
    });

    const statusDataArray = Object.keys(statusCounts).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusCounts[key]
    }));

    const revenueDataArray = Object.keys(revenueByDate).map(date => ({
      date,
      revenue: revenueByDate[date]
    }));

    const topProductsArray = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { 
      totalRevenue: revenue, 
      totalOrders: orders.length, 
      statusData: statusDataArray, 
      revenueData: revenueDataArray,
      topProducts: topProductsArray
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Sales Analytics</h1>
        <p className="text-zinc-500 font-medium mt-2 text-lg">Visual representation of your seller performance.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
            <p className="text-zinc-500 font-medium text-sm mb-1">Total Revenue</p>
            <p className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/50">
            <p className="text-zinc-500 font-medium text-sm mb-1">Total Orders</p>
            <p className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{totalOrders}</p>
          </div>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-12 text-center">
          <p className="text-zinc-500 font-medium">You don&apos;t have any orders yet to show analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Revenue Over Time Chart */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">Revenue Over Time</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888' }} />
                  <YAxis stroke="#888" tick={{ fill: '#888' }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">Order Status Breakdown</h3>
            <div className="h-[300px] w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6 lg:col-span-2">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">Top Selling Products</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#888" tickFormatter={(val) => `$${val}`} />
                  <YAxis dataKey="name" type="category" stroke="#888" tick={{ fill: '#888' }} width={150} />
                  <Tooltip 
                    cursor={{fill: 'rgba(113, 113, 122, 0.1)'}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff', borderRadius: '8px' }}
                    formatter={(value) => [`$${value}`, 'Revenue generated']}
                  />
                  <Bar dataKey="revenue" fill="#18181b" radius={[0, 4, 4, 0]}>
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
