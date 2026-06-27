"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockApi } from "@/services/mockApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electronics", "Clothing", "Furniture", "Automotive"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await mockApi.getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Search Area */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-outfit">Marketplace</h1>
            <p className="text-gray-400 mt-2">Discover premium second-hand items</p>
          </div>
          <div className="w-full md:w-auto flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors pl-12"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6 font-outfit">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                      selectedCategory === category 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/10">
                <p className="text-xl text-gray-400">No products found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  className="mt-6 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link href={`/products/${product._id}`} key={product._id}>
                    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors group cursor-pointer h-full flex flex-col">
                      <div className="h-56 w-full relative overflow-hidden bg-gray-800">
                        <Image 
                          src={product.images[0]} 
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-400 font-bold rounded-full text-sm border border-emerald-500/20">
                          ${product.price}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4 border-t border-white/10">
                          <span>{product.category}</span>
                          <span className="bg-white/5 px-2 py-1 rounded-md">{product.condition}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
