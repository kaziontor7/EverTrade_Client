"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertDialog, Button } from "@heroui/react";
import { getAdminOrders, forceUpdateOrderStatus } from "@/lib/api/admin";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      if (data) {
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
      await forceUpdateOrderStatus(orderId, status);
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
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Global Orders</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Monitor all platform transactions and resolve disputes.</p>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
            <input 
              type="text" 
              placeholder="Search ID or Email..." 
              className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:zinc-100/50 text-zinc-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 font-medium px-4">Order / Item</th>
                  <th className="pb-4 font-medium px-4">Buyer</th>
                  <th className="pb-4 font-medium px-4">Seller</th>
                  <th className="pb-4 font-medium px-4">Amount</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4 text-right">Force Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {filteredOrders.map((order) => {
                  const currentStatus = order.orderStatus?.toLowerCase() || 'pending';
                  
                  return (
                    <tr key={order._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 max-w-[120px] truncate" title={order._id}>
                            #{order._id}
                          </span>
                          <span className="font-medium text-zinc-900 dark:text-white max-w-[150px] truncate" title={order.title}>
                            {order.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-zinc-900 dark:text-white truncate max-w-[150px]" title={order.buyerInfo?.email}>{order.buyerInfo?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-zinc-900 dark:text-white truncate max-w-[120px]" title={order.sellerInfo?.name}>{order.sellerInfo?.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">${order.price?.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                          currentStatus === 'delivered' ? 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' :
                          ['cancelled', 'declined', 'canceled'].includes(currentStatus) ? 'bg-transparent text-zinc-400 border-zinc-200 border-dashed dark:border-zinc-800 line-through' :
                          'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <AlertDialog>
                            <Button className="cursor-pointer px-3 min-w-0 h-8 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded transition-colors uppercase tracking-wider">
                              Cancel
                            </Button>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900 sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
                                    <AlertDialog.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Force Cancel Order?</AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body className="py-6">
                                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                                      Are you sure you want to forcibly cancel order <strong className="text-zinc-900 dark:text-white">#{order._id}</strong>? This should only be used to resolve disputes.
                                    </p>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
                                    <Button slot="close" variant="flat" className="rounded-xl font-medium cursor-pointer">Go Back</Button>
                                    <Button slot="close" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors cursor-pointer" onPress={() => handleUpdateStatus(order._id, 'Cancelled')}>
                                      Force Cancel
                                    </Button>
                                  </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                              </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                          </AlertDialog>
                          
                          {currentStatus !== 'delivered' && (
                            <AlertDialog>
                              <Button className="px-3 min-w-0 h-8 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs rounded transition-colors uppercase tracking-wider">
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
