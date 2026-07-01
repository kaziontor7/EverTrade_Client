import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us | EverTrade",
  description: "The standard for verified pre-owned goods.",
};

export default function AboutPage() {
  return (
    <div className="flex-grow flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] relative">
      <div className="max-w-[1000px] mx-auto w-full px-6 pt-32 pb-24 md:pt-48 md:pb-32 relative z-10">
        
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter leading-[0.95]">
            The standard for pre-owned.
          </h1>
          <p className="text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
            We built EverTrade because buying second-hand shouldn't feel like a gamble. We verify the sellers. We hold the funds. You get exactly what you paid for.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-24 border border-zinc-200 dark:border-zinc-800">
          <Image
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80"
            alt="Minimalist dark tech setup"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        {/* Mission Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-32">
          <div>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">Zero Tolerance.</h3>
            <p className="text-zinc-500 text-lg leading-relaxed">
              We do not allow scammers on this platform. Every seller goes through verification. If a listing looks suspicious, it gets removed. If an item arrives completely different from the description, the buyer is protected by Stripe.
            </p>
          </div>
          
          <div>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">Zero E-Waste.</h3>
            <p className="text-zinc-500 text-lg leading-relaxed">
              Every year, millions of perfectly good items end up in landfills because people prefer to buy new. By creating a marketplace you can actually trust, we are extending the lifecycle of premium goods.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-24 text-center">
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight">Stop buying new.</h2>
          <Link href="/products">
            <button className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-lg rounded-xl transition-colors">
              Browse the Marketplace
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
