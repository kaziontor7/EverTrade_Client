"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";
import { ProductCard } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const categories = ["All", "Electronics", "Mobile Phones", "Fashion", "Automotive", "Furniture"];

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await mockApi.getPaginatedProducts({
          page,
          limit: 8,
          category: selectedCategory,
          search: searchTerm,
          sortBy
        });
        setProducts(response.data);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch slightly for better UX when typing
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#060e20] text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      
      <div className="max-w-[1440px] mx-auto space-y-8 relative z-10">
        
        {/* Header / Search Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-[#0d1527] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-[#e2e8f0] mb-2">Marketplace</h1>
            <p className="text-gray-600 dark:text-[#94a3b8]">Discover premium second-hand items</p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Search products by name or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="et-input pl-12 py-4 w-full text-lg shadow-sm"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 sticky top-24 space-y-6">
            
            <div className="glass-card border border-gray-200 dark:border-white/10 rounded-3xl p-6 bg-white/80 dark:bg-transparent">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sort Results</h2>
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="et-select w-full appearance-none pr-10"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">expand_more</span>
              </div>
            </div>

            <div className="glass-card border border-gray-200 dark:border-white/10 rounded-3xl p-6 bg-white/80 dark:bg-transparent">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
                      selectedCategory === category 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                        : "text-gray-600 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                ))}
              </div>
            </div>
            
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 w-full">
            
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 dark:text-[#94a3b8] font-medium">
                Showing {products.length} of {totalItems} results
              </p>
            </div>

            {loading ? (
              // Skeleton Loader
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card h-80 rounded-2xl animate-pulse bg-gray-200 dark:bg-white/5 border border-gray-200 dark:border-white/10"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              // Empty State
              <div className="text-center py-24 glass-card rounded-3xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent">
                <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">search_off</span>
                <p className="text-xl text-gray-600 dark:text-[#94a3b8]">No products found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSortBy("newest"); }}
                  className="mt-6 btn-secondary py-2"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // Results
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {products.map((product, index) => (
                      <ProductCard key={product._id} product={product} index={index} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8 border-t border-gray-200 dark:border-white/10">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-colors ${
                          page === i + 1 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-emerald-500" 
                            : "border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}
