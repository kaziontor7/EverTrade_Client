"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertDialog, Button } from "@heroui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to force update order status:", error);
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id?.toLowerCase().includes(search.toLowerCase()) || 
    o.buyerInfo?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.sellerInfo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">Global Orders</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Monitor all platform transactions and resolve disputes.</p>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search ID or Email..." 
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="pb-4 font-medium px-4">Order / Item</th>
                  <th className="pb-4 font-medium px-4">Buyer</th>
                  <th className="pb-4 font-medium px-4">Seller</th>
                  <th className="pb-4 font-medium px-4">Amount</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4 text-right">Force Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {filteredOrders.map((order) => {
                  const currentStatus = order.orderStatus?.toLowerCase() || 'pending';
                  
                  return (
                    <tr key={order._id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-purple-600 dark:text-purple-400 max-w-[120px] truncate" title={order._id}>
                            #{order._id}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white max-w-[150px] truncate" title={order.title}>
                            {order.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]" title={order.buyerInfo?.email}>{order.buyerInfo?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]" title={order.sellerInfo?.name}>{order.sellerInfo?.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">${order.price?.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          currentStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                          ['cancelled', 'declined', 'canceled'].includes(currentStatus) ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <Button variant="flat" color="danger" size="sm" className="h-7 text-xs">
                              Cancel
                            </Button>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Icon status="danger" />
                                    <AlertDialog.Heading>Force Cancel Order?</AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Are you sure you want to forcibly cancel order <strong>#{order._id}</strong>? This should only be used to resolve disputes.
                                    </p>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">Go Back</Button>
                                    <Button slot="close" variant="danger" onPress={() => handleUpdateStatus(order._id, 'Cancelled')}>
                                      Force Cancel
                                    </Button>
                                  </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                              </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                          </AlertDialog>
                          
                          {currentStatus !== 'delivered' && (
                            <AlertDialog>
                              <Button variant="flat" color="success" size="sm" className="h-7 text-xs">
                                Deliver
                              </Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="success" />
                                      <AlertDialog.Heading>Force Complete Order?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>
                                        Are you sure you want to forcibly mark order <strong>#{order._id}</strong> as Delivered?
                                      </p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">Go Back</Button>
                                      <Button slot="close" color="success" onPress={() => handleUpdateStatus(order._id, 'Delivered')}>
                                        Force Deliver
                                      </Button>
                                    </AlertDialog.Footer>
                                  </AlertDialog.Dialog>
                                </AlertDialog.Container>
                              </AlertDialog.Backdrop>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
