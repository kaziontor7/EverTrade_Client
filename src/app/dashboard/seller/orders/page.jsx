"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`${API_URL}/orders/seller/${session.user.id}`);
        if (res.ok) {
          const sellerOrders = await res.json();
          setOrders(sellerOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrders = orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Sales History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track orders placed by buyers for your listings.</p>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Manage Incoming Orders</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">You haven't made any sales yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                  <th className="pb-4 font-medium px-2">Order ID</th>
                  <th className="pb-4 font-medium px-2">Product</th>
                  <th className="pb-4 font-medium px-2">Qty</th>
                  <th className="pb-4 font-medium px-2">Buyer ID</th>
                  <th className="pb-4 font-medium px-2">Date</th>
                  <th className="pb-4 font-medium px-2">Earnings</th>
                  <th className="pb-4 font-medium px-2">Status</th>
                  <th className="pb-4 font-medium px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {orders.map((order) => {
                  
                  const getNextStatus = (current) => {
                    if (!current) return 'Accepted';
                    const normalized = current.toLowerCase();
                    if (normalized === 'pending') return 'Accepted';
                    if (normalized === 'accepted') return 'Processing';
                    if (normalized === 'processing') return 'Shipped';
                    if (normalized === 'shipped') return 'Delivered';
                    return null;
                  };
                  
                  const nextStatus = getNextStatus(order.orderStatus);
                  const isPending = !order.orderStatus || order.orderStatus.toLowerCase() === 'pending';
                  const isDeclined = ['declined', 'cancelled', 'canceled', 'refund in progress'].includes(order.orderStatus?.toLowerCase());

                  return (
                    <tr key={order._id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2 font-mono text-sm text-gray-500 dark:text-gray-500 max-w-[100px] truncate" title={order._id}>{order._id}</td>
                      <td className="py-4 px-2 font-medium text-gray-900 dark:text-white truncate max-w-[150px]" title={order.title}>{order.title}</td>
                      <td className="py-4 px-2 text-center">{order.quantity || 1}</td>
                      <td className="py-4 px-2 font-mono text-sm max-w-[100px] truncate" title={order.buyerInfo?.userId || 'Unknown'}>{order.buyerInfo?.userId || 'Unknown'}</td>
                      <td className="py-4 px-2 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-2 text-emerald-600 dark:text-emerald-400 font-bold">${order.price.toLocaleString()}</td>
                      <td className="py-4 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                          ['declined', 'cancelled', 'canceled'].includes(order.orderStatus?.toLowerCase()) ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                          order.orderStatus?.toLowerCase() === 'refund in progress' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20' :
                          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          {nextStatus && !isDeclined && (
                            <button
                              onClick={() => updateOrderStatus(order._id, nextStatus)}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              {nextStatus === 'Accepted' ? 'Accept' : nextStatus}
                            </button>
                          )}
                          {isPending && (
                            <AlertDialog>
                              <Button variant="danger" size="sm">Decline</Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="danger" />
                                      <AlertDialog.Heading>Decline this order?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>
                                        Are you sure you want to decline this order? It will be marked as <strong>Refund in Progress</strong> and the buyer will be notified.
                                      </p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">
                                        Cancel
                                      </Button>
                                      <Button slot="close" variant="danger" onPress={() => updateOrderStatus(order._id, 'Refund in Progress')}>
                                        Yes, Decline Order
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
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
