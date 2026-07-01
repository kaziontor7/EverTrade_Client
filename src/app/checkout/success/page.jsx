import Link from "next/link";
import { redirect } from 'next/navigation';
import { stripe } from '../../../lib/stripe';
import SyncCheckoutOnMount from '../../../components/SyncCheckoutOnMount';
import { protectedFetch } from '../../../lib/core/server';
export const metadata = {
  title: "Payment Successful | EverTrade",
  description: "Your payment was processed successfully.",
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id');
  }

  const {
    status,
    amount_total,
    metadata,
    payment_intent,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  if (status === 'open') {
    return redirect('/');
  }

  const transactionId = typeof payment_intent === 'string' ? payment_intent : (payment_intent?.id || session_id);
  const checkoutData = {
    session_id,
    payment_intent: transactionId,
    userId: metadata.userId,
    customerEmail,
    amount: amount_total,
    status
  };

  let orders = [];
  try {
    orders = await protectedFetch(`orders/transaction/${transactionId}`);
  } catch (error) {
    console.error("Failed to fetch orders for transaction", error);
  }

  return (
    <div className="flex flex-col items-center pt-20 pb-20 min-h-[calc(100vh-100px)] text-center px-6 relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>

      <div className="relative z-10 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 p-12 rounded-2xl max-w-lg w-full flex flex-col items-center">
        
        <div className="relative w-24 h-24 mb-8">
          <div className="relative bg-zinc-900 dark:bg-white text-white dark:text-black w-full h-full rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-5xl">check</span>
          </div>
        </div>

        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">
          Payment Successful!
        </h1>
        <p className="text-zinc-500 font-medium mb-6 leading-relaxed">
          We appreciate your business! A confirmation email will be sent to <strong>{customerEmail}</strong>.
        </p>

        <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-8 text-left shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">Receipt & Order Details</h3>
          
          <div className="space-y-4">
            {/* Products List (No images) */}
            {orders.length > 0 && (
              <div className="space-y-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Items Purchased</span>
                {orders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 dark:text-white truncate max-w-[200px]">{order.title}</span>
                      <span className="text-zinc-500 font-medium text-xs">Qty: {order.quantity || 1}</span>
                    </div>
                    <span className="font-black text-zinc-900 dark:text-white">
                      ${((order.price * (order.quantity || 1))).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Summary */}
            <div className="space-y-3 text-sm">
              <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider block mb-2">Payment Info</span>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Transaction ID</span>
                <span className="font-bold text-zinc-900 dark:text-white truncate max-w-[150px]">{typeof payment_intent === 'string' ? payment_intent : (payment_intent?.id || session_id)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Payment Date</span>
                <span className="font-bold text-zinc-900 dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="font-bold text-zinc-900 dark:text-white">Total Amount</span>
                <span className="font-black text-zinc-900 dark:text-white text-base">${(amount_total / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {status === 'complete' && <SyncCheckoutOnMount checkoutData={checkoutData} />}

        <div className="w-full space-y-4">
          <Link href="/dashboard/buyer/orders">
            <button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-4 rounded-xl transition-colors mb-4">
              View Order History
            </button>
          </Link>
          <Link href="/products">
            <button className="w-full bg-transparent border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white font-bold py-4 rounded-xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
