"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (session?.user?.id) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const res = await fetch(`${API_URL}/payments/${session.user.id}`);
          if (res.ok) {
            const userPayments = await res.json();
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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Payment History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View all your past transactions and payment statuses.</p>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-sm">
                <th className="pb-4 font-medium px-4 whitespace-nowrap">Transaction ID</th>
                <th className="pb-4 font-medium px-4 whitespace-nowrap">Date</th>
                <th className="pb-4 font-medium px-4 whitespace-nowrap text-right">Amount</th>
                <th className="pb-4 font-medium px-4 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {payments.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">No payment history found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">Loading...</td>
                </tr>
              )}
              {payments.map((payment) => (
                <tr key={payment._id} className="text-gray-800 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm text-gray-500">{payment.transactionId}</td>
                  <td className="py-4 px-4 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-bold text-right">${payment.amount?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block capitalize ${
                      payment.paymentStatus === 'success' || payment.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                    }`}>
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
