"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";
import { getSellerOrders, updateOrderStatus } from "@/lib/api/orders";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user?.id) return;
      try {
        const sellerOrders = await getSellerOrders(session.user.id);
        if (sellerOrders) {
          setOrders(Array.isArray(sellerOrders) ? sellerOrders : (sellerOrders.orders || []));
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrders = orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto min-w-0">
      <div className="border-b-2 border-zinc-900 dark:border-white pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Sales History</h1>
        <p className="text-zinc-500 font-bold mt-2 text-sm uppercase tracking-wider">Track orders placed by buyers for your listings.</p>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">Manage Incoming Orders</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider">You haven't made any sales yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 font-medium px-4">Order ID</th>
                  <th className="pb-4 font-medium px-4">Product</th>
                  <th className="pb-4 font-medium px-4">Qty</th>
                  <th className="pb-4 font-medium px-4">Buyer ID</th>
                  <th className="pb-4 font-medium px-4">Date</th>
                  <th className="pb-4 font-medium px-4">Earnings</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
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
                    <tr key={order._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-zinc-600 dark:text-zinc-500 max-w-[100px] truncate" title={order._id}>#{order._id.substring(0,8)}...</td>
                      <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white truncate max-w-[150px]" title={order.title}>{order.title}</td>
                      <td className="py-4 px-4 text-center font-medium">{order.quantity || 1}</td>
                      <td className="py-4 px-4 font-mono text-sm max-w-[100px] truncate text-zinc-600 dark:text-zinc-400" title={order.buyerInfo?.userId || 'Unknown'}>{order.buyerInfo?.userId || 'Unknown'}</td>
                      <td className="py-4 px-4 text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 font-black text-zinc-900 dark:text-white">${order.price.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                          order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' :
                          ['declined', 'cancelled', 'canceled'].includes(order.orderStatus?.toLowerCase()) ? 'bg-transparent text-zinc-400 border-zinc-200 border-dashed dark:border-zinc-800 line-through' :
                          order.orderStatus?.toLowerCase() === 'refund in progress' ? 'bg-zinc-200 text-zinc-600 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-400 dark:border-zinc-600' :
                          'bg-zinc-50 text-zinc-500 border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800'
                        }`}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {nextStatus && !isDeclined && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, nextStatus)}
                              className="px-3 min-w-0 h-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs rounded transition-colors uppercase tracking-wider"
                            >
                              {nextStatus === 'Accepted' ? 'Accept' : nextStatus}
                            </button>
                          )}
                          {isPending && (
                            <AlertDialog>
                              <button className="px-3 min-w-0 h-8 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs rounded transition-colors uppercase tracking-wider">
                                Decline
                              </button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="danger" />
                                      <AlertDialog.Heading>Decline this order?</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p className="text-zinc-600">
                                        Are you sure you want to decline this order? It will be marked as <strong>Refund in Progress</strong> and the buyer will be notified.
                                      </p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary" className="font-bold uppercase tracking-wider">
                                        Cancel
                                      </Button>
                                      <Button slot="close" variant="danger" onPress={() => handleUpdateOrderStatus(order._id, 'Refund in Progress')} className="font-bold uppercase tracking-wider rounded-none">
                                        Yes, Decline
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
