"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { getSellerOrders } from "@/lib/api/orders";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Sales Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visual representation of your seller performance.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white">{totalOrders}</p>
          </div>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">You don&apos;t have any orders yet to show analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Over Time Chart */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Revenue Over Time</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#888" tick={{ fill: '#888' }} />
                  <YAxis stroke="#888" tick={{ fill: '#888' }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Status Breakdown</h3>
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
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Selling Products</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#888" tickFormatter={(val) => `$${val}`} />
                  <YAxis dataKey="name" type="category" stroke="#888" tick={{ fill: '#888' }} width={150} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                    formatter={(value) => [`$${value}`, 'Revenue generated']}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]}>
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
