import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us | EverTrade",
  description: "Learn about EverTrade's mission and story.",
};

export default function AboutPage() {
  return (
    <div className="flex-grow flex flex-col min-h-screen bg-gray-50 dark:bg-[#060e20] relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      
      <div className="max-w-[1000px] mx-auto w-full px-6 py-12 md:py-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6">
            <span className="material-symbols-outlined text-[18px]">info</span>
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-6 tracking-tight">
            Redefining the <span className="text-emerald-400">Second-Hand</span> Market.
          </h1>
          <p className="text-gray-600 dark:text-[#94a3b8] text-lg leading-relaxed">
            EverTrade was founded on a simple principle: high-quality items deserve a second life. 
            We are building the most secure, sustainable, and premium marketplace for buying and selling pre-owned goods.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-16 border border-gray-200 dark:border-white/10 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80"
            alt="Team working together"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        {/* Mission Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-2xl">eco</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-3">Our Mission</h3>
            <p className="text-gray-600 dark:text-[#94a3b8] leading-relaxed">
              To drastically reduce electronic and material waste by creating a trusted ecosystem where premium goods circulate longer within the community.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-3">Our Promise</h3>
            <p className="text-gray-600 dark:text-[#94a3b8] leading-relaxed">
              We guarantee a secure platform. Every seller is vetted, and every transaction is protected, ensuring you can buy and sell with absolute peace of mind.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-100 dark:bg-[#131b2e] p-10 rounded-3xl border border-gray-200 dark:border-[#475569]/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4">Join the Movement</h2>
          <p className="text-gray-600 dark:text-[#94a3b8] mb-8 max-w-lg mx-auto">
            Ready to give your unused tech a second life or find your next great deal?
          </p>
          <Link href="/signup">
            <button className="btn-primary">
              Become a Member Today
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
