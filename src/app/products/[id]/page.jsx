"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById, reportProduct } from "@/lib/api/products";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/contexts/CartContext";
import { toast, AlertDialog, Button } from "@heroui/react";
import ProductReviews from "@/components/ProductReviews";

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
        const data = await getProductById(id);
        if (data && data._id) {
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

  const { addToCart } = useCart();

  const handleCheckout = () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    if (session?.user?.role === 'seller' || session?.user?.role === 'admin') {
      toast.danger("Sellers and Admins cannot purchase products");
      return;
    }
    // Directly adding to cart and redirecting to the generic checkout
    addToCart(product);
    router.push(`/checkout`);
  };

  const handleAddToCart = () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    if (session?.user?.role === 'seller' || session?.user?.role === 'admin') {
      toast.danger("Sellers and Admins cannot add products to cart");
      return;
    }
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleReport = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    
    try {
      await reportProduct(id);
      setProduct(prev => ({ ...prev, reported: true }));
      toast.success("Listing reported successfully. Our admins will review it shortly.");
    } catch (error) {
      console.error(error);
      toast.danger("Failed to report listing.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium mb-12 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Marketplace
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative">
          
          {/* Empty Report Button Placeholder (Moved to Right Column) */}

          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex-shrink-0 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <Image 
                src={typeof product.images === 'string' ? product.images : (product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80")} 
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Thumbnails placeholder for multiple images */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${idx === 0 ? 'border-zinc-900 dark:border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <Image src={img} alt={`${product.title} ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full flex flex-col py-4">
            <div className="flex justify-between items-start gap-4">
              <div className="w-full">
                <div className="flex justify-between items-start w-full mb-4">
                  <h1 className="text-3xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">{product.title}</h1>
                  
                  {/* Report Button */}
                  {!product.reported ? (
                    <AlertDialog>
                      <Button 
                        variant="light"
                        className="cursor-pointer min-w-0 p-0 h-auto bg-transparent data-[hover=true]:bg-transparent text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium shrink-0 mt-2"
                        title="Report this listing"
                      >
                        <span className="material-symbols-outlined text-[18px]">flag</span>
                        Report
                      </Button>
                      <AlertDialog.Backdrop>
                        <AlertDialog.Container>
                          <AlertDialog.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900 sm:max-w-[400px]">
                            <AlertDialog.CloseTrigger />
                            <AlertDialog.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
                              <AlertDialog.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Report Listing?</AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body className="py-6">
                              <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                                Are you sure you want to report <strong className="text-zinc-900 dark:text-white">{product.title}</strong>? Our admins will review this listing shortly.
                              </p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
                              <Button slot="close" variant="flat" className="rounded-xl font-medium cursor-pointer">Cancel</Button>
                              <Button slot="close" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors cursor-pointer" onPress={handleReport}>
                                Yes, Report
                              </Button>
                            </AlertDialog.Footer>
                          </AlertDialog.Dialog>
                        </AlertDialog.Container>
                      </AlertDialog.Backdrop>
                    </AlertDialog>
                  ) : (
                    <div className="text-red-500 flex items-center gap-1 text-sm font-medium shrink-0 mt-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      Reported
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm font-semibold mb-6">
                  <span className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 capitalize">
                    {product.category}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 capitalize">
                    Condition: {product.condition}
                  </span>
                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{product.averageRating.toFixed(1)}</span>
                      <span className="text-zinc-500">({product.reviewCount})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-4xl lg:text-5xl font-black text-zinc-900 dark:text-white">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <div className="flex-1 min-h-[150px]">
              <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                {product.description}
              </p>
            </div>

            {/* Seller Card - Integrated */}
            <div className="mt-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-lg">
                  {product.sellerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Listed by</p>
                  <p className="text-zinc-900 dark:text-white font-bold flex items-center gap-1.5">
                    {product.sellerName}
                    {product.sellerVerified && (
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shadow-sm" title="Verified Seller">
                        <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-bold text-sm">
                Contact Seller
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-1/2 py-4 bg-transparent border-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white text-zinc-900 dark:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-lg"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Add to Cart
              </button>
              <button 
                onClick={handleCheckout}
                className="w-full sm:w-1/2 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Buy Now
              </button>
            </div>
            <p className="text-center text-xs font-semibold text-zinc-400 mt-6 flex justify-center items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span> Protected by Stripe Payments
            </p>
          </div>
        </div>
        {/* Product Reviews */}
        <ProductReviews product={product} />
      </div>
    </div>
  );
}
