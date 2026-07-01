"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserPayments } from "@/lib/api/payments";

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (session?.user?.id) {
        try {
          const userPayments = await getUserPayments(session.user.id);
          if (userPayments) {
            setPayments(userPayments);
          }
        } catch (error) {
          console.error("Failed to fetch payments:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPayments();
  }, [session]);

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Payment History</h1>
        <p className="text-zinc-500 font-medium mt-2 text-lg">View all your past transactions and payment statuses.</p>
      </div>

      <div className="pt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                <th className="pb-4 px-4 whitespace-nowrap">Transaction ID</th>
                <th className="pb-4 px-4 whitespace-nowrap">Date</th>
                <th className="pb-4 px-4 whitespace-nowrap text-right">Amount</th>
                <th className="pb-4 px-4 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {payments.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-zinc-500 font-medium">No payment history found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              )}
              {payments.map((payment) => (
                <tr key={payment._id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="py-6 px-4 font-mono text-sm text-zinc-500">{payment.transactionId}</td>
                  <td className="py-6 px-4 text-sm font-medium">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-6 px-4 text-zinc-900 dark:text-white font-black text-right">${payment.amount?.toLocaleString()}</td>
                  <td className="py-6 px-4 text-center">
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-bold inline-block capitalize tracking-wide">
                      {payment.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
