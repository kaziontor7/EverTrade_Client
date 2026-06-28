"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  
  // Mock payment data
  const [payments] = useState([
    { id: "TXN-7B93M", product: "Vintage Film Camera - Canon AE-1", date: "2026-06-25", amount: 250, status: "Paid" },
    { id: "TXN-2A41K", product: "Apple iPhone 12 Pro Max", date: "2026-06-12", amount: 650, status: "Paid" },
    { id: "TXN-9F88P", product: "Nintendo Switch OLED", date: "2026-05-30", amount: 220, status: "Refunded" }
  ]);

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
                <th className="pb-4 font-medium px-4 whitespace-nowrap">Item</th>
                <th className="pb-4 font-medium px-4 whitespace-nowrap">Date</th>
                <th className="pb-4 font-medium px-4 whitespace-nowrap text-right">Amount</th>
                <th className="pb-4 font-medium px-4 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {payments.map((payment) => (
                <tr key={payment.id} className="text-gray-800 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm text-gray-500">{payment.id}</td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{payment.product}</td>
                  <td className="py-4 px-4 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-bold text-right">৳{payment.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                      payment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                    }`}>
                      {payment.status}
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
