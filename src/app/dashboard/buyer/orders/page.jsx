"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";
import { getBuyerOrders, updateOrderStatus } from "@/lib/api/orders";

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        try {
          const userOrders = await getBuyerOrders(session.user.id);
          if (userOrders) {
            setOrders(userOrders);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchOrders();
  }, [session]);

  const handleCancelOrder = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'Refund in Progress');
      const updatedOrders = orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Refund in Progress' } : o);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">My Orders</h2>
        <p className="text-zinc-500 font-medium mt-2 text-lg">View and manage your recent purchases.</p>
      </div>
      
      <div className="pt-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-zinc-300 dark:text-zinc-700 text-3xl">shopping_cart</span>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">No orders found</h3>
            <p className="text-zinc-500 font-medium">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 px-4 whitespace-nowrap">Order ID</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Product</th>
                  <th className="pb-4 px-4 whitespace-nowrap text-center">Qty</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Date</th>
                  <th className="pb-4 px-4 whitespace-nowrap text-right">Price</th>
                  <th className="pb-4 px-4 whitespace-nowrap text-center">Status</th>
                  <th className="pb-4 px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {orders.map((order) => (
                  <tr key={order._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-6 px-4 font-mono text-sm text-zinc-500">{order._id}</td>
                    <td className="py-6 px-4 font-bold text-zinc-900 dark:text-white">{order.title}</td>
                    <td className="py-6 px-4 text-center font-medium">{order.quantity || 1}</td>
                    <td className="py-6 px-4 text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-6 px-4 text-zinc-900 dark:text-white font-black text-right">${order.price?.toLocaleString()}</td>
                    <td className="py-6 px-4 text-center">
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-bold inline-block capitalize tracking-wide">
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {(() => {
                        const s = order.orderStatus?.toLowerCase() || 'pending';
                        if (['shipped', 'delivered', 'declined', 'cancelled', 'canceled', 'refund in progress'].includes(s)) {
                          return null;
                        }
                        return (
                          <AlertDialog>
                            <Button className="px-4 py-2 bg-zinc-900 hover:bg-red-600 text-white font-bold text-xs rounded transition-colors uppercase tracking-wider">Cancel</Button>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Icon status="danger" />
                                    <AlertDialog.Heading>Cancel this order?</AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Are you sure you want to cancel this order? It will be marked as <strong>Refund in Progress</strong>.
                                    </p>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">
                                      Keep Order
                                    </Button>
                                    <Button slot="close" variant="danger" onPress={() => handleCancelOrder(order._id)}>
                                      Yes, Cancel Order
                                    </Button>
                                  </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                              </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                          </AlertDialog>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
