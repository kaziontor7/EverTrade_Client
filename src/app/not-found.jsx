import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] py-24 text-center px-6 relative overflow-hidden bg-transparent">
      
      <div className="relative z-10 bg-white dark:bg-zinc-900/50 p-12 rounded-3xl max-w-lg w-full flex flex-col items-center border border-zinc-200 dark:border-zinc-800/50 shadow-xl">
        
        {/* 404 Illustration */}
        <div className="relative mb-8 flex flex-col items-center justify-center">
          <span className="text-8xl md:text-9xl font-black text-zinc-900 dark:text-white tracking-tighter">
            404
          </span>
          <div className="mt-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <span className="material-symbols-outlined text-4xl">broken_image</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
          Lost in the Marketplace
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
          The page or product you're looking for seems to have vanished. It might have been sold, removed, or the link is incorrect.
        </p>

        <Link href="/" className="w-full">
          <button className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
