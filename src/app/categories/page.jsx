import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Categories | EverTrade",
  description: "Browse premium pre-owned categories.",
};

const CATEGORIES = [
  { name: "Electronics", icon: "devices", count: 1240, color: "text-blue-400", bg: "bg-blue-500/10", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80" },
  { name: "Furniture", icon: "chair", count: 856, color: "text-amber-400", bg: "bg-amber-500/10", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" },
  { name: "Vehicles", icon: "directions_car", count: 432, color: "text-red-400", bg: "bg-red-500/10", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80" },
  { name: "Fashion", icon: "checkroom", count: 2105, color: "text-pink-400", bg: "bg-pink-500/10", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80" },
  { name: "Mobile Phones", icon: "smartphone", count: 1870, color: "text-indigo-400", bg: "bg-indigo-500/10", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" },
  { name: "Books", icon: "menu_book", count: 320, color: "text-emerald-400", bg: "bg-emerald-500/10", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80" },
  { name: "Sports & Outdoors", icon: "sports_basketball", count: 645, color: "text-orange-400", bg: "bg-orange-500/10", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80" },
  { name: "Home Appliances", icon: "kitchen", count: 980, color: "text-teal-400", bg: "bg-teal-500/10", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&q=80" },
];

export default function CategoriesPage() {
  return (
    <div className="flex-grow flex flex-col min-h-screen bg-gray-50 dark:bg-[#060e20] relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      
      <div className="max-w-[1440px] mx-auto w-full px-6 py-12 md:py-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-4 tracking-tight">
            Explore <span className="text-emerald-400">Categories</span>
          </h1>
          <p className="text-gray-600 dark:text-[#94a3b8] text-lg max-w-2xl mx-auto">
            Find exactly what you're looking for by browsing our curated collection of premium second-hand categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, index) => (
            <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}>
              <div 
                className="group relative h-64 rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className={`w-12 h-12 rounded-2xl ${cat.bg} border border-white/10 flex items-center justify-center mb-4 backdrop-blur-md group-hover:-translate-y-2 transition-transform duration-300`}>
                    <span className={`material-symbols-outlined text-2xl ${cat.color}`}>{cat.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-300 text-sm font-medium">
                    <span>{cat.count.toLocaleString()} Listings</span>
                    <span className="material-symbols-outlined ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-400">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
