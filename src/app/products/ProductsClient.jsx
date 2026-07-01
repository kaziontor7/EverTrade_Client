"use client";

import { useState, useEffect, Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, ListBox } from "@heroui/react";
import { useSearchParams } from "next/navigation";

import { getProducts } from "@/lib/api/products";

// Inner component that uses useSearchParams
function ProductsContent({ initialData = {}, wishList = [], user, initialCategory = "All" }) {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || "";

  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(initialData?.currentPage || 1);
  
  const [products, setProducts] = useState(initialData?.products || []);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [totalItems, setTotalItems] = useState(initialData?.totalItems || 0);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ["All", "Electronics", "Mobile Phones", "Fashion", "Automotive", "Furniture", "Books"];

  // Update local search term if URL changes
  useEffect(() => {
    setSearchTerm(searchFromUrl);
  }, [searchFromUrl]);

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
    <div className="min-h-screen bg-[var(--bg-color)] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-[1440px] mx-auto space-y-8 relative z-10">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">Marketplace</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium mt-2">Discover premium pre-owned items</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-56 flex-shrink-0 lg:sticky lg:top-28 space-y-6 pt-2">
            <div>
              <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Categories</h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium text-sm ${selectedCategory === category
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-dim-color)] hover:text-[var(--text-primary)]"
                      }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 w-full">

            {/* Integrated Toolbar */}
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4 py-2 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-4">
                <p className="text-[var(--text-secondary)] font-medium text-sm">
                  Showing {paginatedProducts.length} of {totalItems} results
                </p>
                {isLoading && <span className="material-symbols-outlined animate-spin text-[var(--text-muted)] text-lg">progress_activity</span>}
              </div>
              
              <div className="w-48">
                <Select
                  selectedKey={sortBy}
                  onSelectionChange={(key) => {
                    const val = (key && typeof key === 'object' && key.has) ? Array.from(key)[0] : key;
                    if (val) setSortBy(val);
                  }}
                  aria-label="Sort by"
                  classNames={{
                    trigger: "bg-transparent border-none hover:bg-[var(--surface-dim-color)] shadow-none h-10 rounded-lg pl-3 pr-2",
                    value: "text-[var(--text-primary)] font-bold text-sm",
                  }}
                >
                  <Select.Popover>
                    <ListBox className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl shadow-xl p-1">
                      <ListBox.Item id="newest" textValue="Newest Arrivals" className="px-3 py-2 hover:bg-[var(--surface-dim-color)] rounded-lg cursor-pointer text-[var(--text-primary)] font-medium text-sm">Newest Arrivals</ListBox.Item>
                      <ListBox.Item id="price_asc" textValue="Price: Low to High" className="px-3 py-2 hover:bg-[var(--surface-dim-color)] rounded-lg cursor-pointer text-[var(--text-primary)] font-medium text-sm">Price: Low to High</ListBox.Item>
                      <ListBox.Item id="price_desc" textValue="Price: High to Low" className="px-3 py-2 hover:bg-[var(--surface-dim-color)] rounded-lg cursor-pointer text-[var(--text-primary)] font-medium text-sm">Price: High to Low</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            {paginatedProducts.length === 0 && !isLoading ? (
              // Empty State
              <div className="text-center py-24 premium-card bg-[var(--surface-dim-color)]">
                <span className="material-symbols-outlined text-5xl text-[var(--text-muted)] mb-4">search_off</span>
                <p className="text-lg font-bold text-[var(--text-primary)] mb-2">No products found</p>
                <p className="text-[var(--text-secondary)] mb-6">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setSortBy("newest"); }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              // Results
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard key={product._id} product={product} index={index} user={user} wishList={wishList} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-8">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] disabled:opacity-50 disabled:bg-[var(--surface-dim-color)] hover:bg-[var(--surface-dim-color)] transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${currentPage === i + 1
                          ? "bg-[var(--accent-color)] text-white shadow-sm"
                          : "border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] hover:bg-[var(--surface-dim-color)]"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-primary)] disabled:opacity-50 disabled:bg-[var(--surface-dim-color)] hover:bg-[var(--surface-dim-color)] transition-colors shadow-sm"
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

export default function ProductsClient(props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-color)] py-12 flex justify-center"><div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProductsContent {...props} />
    </Suspense>
  );
}
