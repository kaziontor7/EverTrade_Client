"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, Input, Select, ListBox } from "@heroui/react";

import { getProducts } from "@/lib/api/products";

export default function ProductsClient({ initialData = {}, wishList = [], user, initialCategory = "All" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(initialData?.currentPage || 1);
  
  const [products, setProducts] = useState(initialData?.products || []);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [totalItems, setTotalItems] = useState(initialData?.totalItems || 0);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ["All", "Electronics", "Mobile Phones", "Fashion", "Automotive", "Furniture"];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when category or sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy]);

  // Fetch data from API
  useEffect(() => {
    let isMounted = true;
    
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts({
          search: debouncedSearch,
          category: selectedCategory,
          sort: sortBy,
          page,
          limit: 8
        });
        
        if (isMounted && data) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
        }
      } catch (err) {
        console.error("Failed to fetch filtered products:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // If it's the exact same as initialData on first render, we could skip it, 
    // but fetching ensures freshness if client mounts late.
    fetchFilteredProducts();
    
    return () => { isMounted = false; };
  }, [debouncedSearch, selectedCategory, sortBy, page]);

  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = products;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-20 pointer-events-none">search</span>
            <TextField 
              value={searchTerm} 
              onChange={(val) => setSearchTerm(typeof val === 'string' ? val : (val?.target?.value || ""))}
              aria-label="Search products"
              className="w-full"
            >
              <Input
                type="text"
                placeholder="Search products by name or keywords..."
                className="et-input pl-12 py-4 w-full text-lg shadow-sm"
              />
            </TextField>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 space-y-6">

            <div className="glass-card border border-gray-200 dark:border-white/10 rounded-3xl p-6 bg-white/80 dark:bg-transparent">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Sort Results</h2>
              <div className="relative">
                <Select
                  selectedKey={sortBy}
                  onSelectionChange={(key) => {
                    // React Aria / HeroUI v3 passes the key directly, or a Set. Handle both.
                    const val = (key && typeof key === 'object' && key.has) ? Array.from(key)[0] : key;
                    if (val) setSortBy(val);
                  }}
                  aria-label="Sort by"
                >
                  <Select.Trigger className="et-select w-full pr-10 flex justify-between items-center text-left">
                    <Select.Value />
                    <span className="material-symbols-outlined text-gray-500 pointer-events-none text-sm">expand_more</span>
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-1 shadow-xl">
                      <ListBox.Item id="newest" textValue="Newest Arrivals" className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer">Newest Arrivals</ListBox.Item>
                      <ListBox.Item id="price_asc" textValue="Price: Low to High" className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer">Price: Low to High</ListBox.Item>
                      <ListBox.Item id="price_desc" textValue="Price: High to Low" className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg cursor-pointer">Price: High to Low</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            <div className="glass-card border border-gray-200 dark:border-white/10 rounded-3xl p-6 bg-white/80 dark:bg-transparent">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${selectedCategory === category
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
                Showing {paginatedProducts.length} of {totalItems} results
              </p>
            </div>

            {paginatedProducts.length === 0 ? (
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
                    {paginatedProducts.map((product, index) => (
                      <ProductCard key={product._id} product={product} index={index} user={user} wishList={wishList} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-colors ${currentPage === i + 1
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border border-emerald-500"
                          : "border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
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
