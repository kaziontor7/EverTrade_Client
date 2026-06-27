import Link from "next/link";

export const metadata = {
  title: "Payment Successful | EverTrade",
  description: "Your payment was processed successfully.",
};

export default function CheckoutSuccessPage() {
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
        <p className="text-gray-600 dark:text-[#94a3b8] mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been placed and is currently being processed by the seller.
        </p>

        <div className="w-full space-y-4">
          <Link href="/dashboard/buyer">
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
