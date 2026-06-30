import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[80vh] py-24 text-center px-6 relative overflow-hidden bg-transparent">
      
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="orb orb-emerald w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]"></div>

      <div className="relative z-10 glass-card p-12 rounded-3xl max-w-lg w-full flex flex-col items-center border border-emerald-500/10">
        
        {/* 404 Illustration (CSS Art) */}
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-glow-pulse"></div>
          <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-500 tracking-tighter">
            404
          </span>
          <div className="absolute -bottom-2 -right-2 bg-red-500/10 text-red-400 p-2 rounded-xl backdrop-blur-md border border-red-500/20 rotate-12">
            <span className="material-symbols-outlined text-3xl">broken_image</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">
          Lost in the Marketplace
        </h2>
        <p className="text-gray-600 dark:text-[#94a3b8] mb-8 leading-relaxed">
          The page or product you're looking for seems to have vanished. It might have been sold, removed, or the link is incorrect.
        </p>

        <Link href="/">
          <button className="btn-primary w-full py-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] group">
            <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
