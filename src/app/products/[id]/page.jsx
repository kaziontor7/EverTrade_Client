"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockApi } from "@/services/mockApi";
import { useSession } from "@/lib/auth-client";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          router.push("/products"); // Redirect if not found
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, router]);

  const handleCheckout = () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    router.push(`/checkout/${id}`);
  };

  const handleReport = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    if (confirm("Are you sure you want to report this listing to the admins?")) {
      try {
        await mockApi.reportProduct(id);
        alert("Listing reported successfully. Our admins will review it shortly.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Marketplace
        </Link>

        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl flex flex-col lg:flex-row gap-10 relative">
          
          {/* Report Button */}
          <button 
            onClick={handleReport}
            className="absolute top-6 right-6 text-gray-500 dark:text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm font-medium"
            title="Report this listing"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
            Report
          </button>

          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10">
              <Image 
                src={product.images[0]} 
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails placeholder for multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-4 mt-4">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer ${idx === 0 ? 'border-emerald-500' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <Image src={img} alt={`${product.title} ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-outfit mb-2">{product.title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-white/5 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                    {product.category}
                  </span>
                  <span className="bg-white/5 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10">
                    Condition: {product.condition}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">
                ${product.price}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div className="mt-8 bg-gray-100/60 dark:bg-black/40 rounded-2xl p-6 border border-gray-200 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-lime-400 rounded-full flex items-center justify-center text-gray-950 font-bold text-lg">
                  {product.sellerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Listed by</p>
                  <p className="text-gray-900 dark:text-white font-medium">{product.sellerName}</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/10 transition-colors font-medium text-sm">
                Contact Seller
              </button>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-gray-900 dark:text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Secure Checkout
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">Protected by Stripe Payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
