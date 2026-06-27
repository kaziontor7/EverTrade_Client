"use client";

export default function SalesAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Sales Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Visual representation of your seller performance.</p>
      </div>
      
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <p className="text-gray-600 dark:text-gray-400">Charts will go here.</p>
      </div>
    </div>
  );
}
