import Link from "next/link";
import { redirect } from 'next/navigation';
import { stripe } from '../../../lib/stripe';
import SyncCheckoutOnMount from '../../../components/SyncCheckoutOnMount';
import { serverFetch } from '../../../lib/core/server';
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
    orders = await serverFetch(`orders/transaction/${transactionId}`);
  } catch (error) {
    console.error("Failed to fetch orders for transaction", error);
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] text-center px-6 relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="orb orb-emerald w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]"></div>

      <div className="relative z-10 glass-card p-12 rounded-3xl max-w-lg w-full flex flex-col items-center border border-emerald-500/20">
        
        {/* Success Icon */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-emerald-500 text-white w-full h-full rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <span className="material-symbols-outlined text-5xl">check</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-[#94a3b8] mb-6 leading-relaxed">
          We appreciate your business! A confirmation email will be sent to <strong>{customerEmail}</strong>.
        </p>

        <div className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl p-6 mb-8 text-left shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-white/5 pb-2">Receipt & Order Details</h3>
          
          <div className="space-y-4">
            {/* Products List (No images) */}
            {orders.length > 0 && (
              <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-white/5">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items Purchased</span>
                {orders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{order.title}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">Qty: {order.quantity || 1}</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${((order.price * (order.quantity || 1))).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Summary */}
            <div className="space-y-3 text-sm">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Payment Info</span>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{typeof payment_intent === 'string' ? payment_intent : (payment_intent?.id || session_id)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Payment Date</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/5">
                <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">${(amount_total / 100).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {status === 'complete' && <SyncCheckoutOnMount checkoutData={checkoutData} />}

        <div className="w-full space-y-4">
          <Link href="/dashboard/buyer/orders">
            <button className="btn-primary w-full py-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] mb-4">
              View Order History
            </button>
          </Link>
          <Link href="/products">
            <button className="btn-secondary w-full py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
