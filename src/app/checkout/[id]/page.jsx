"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockApi } from "@/services/mockApi";
import { useSession } from "@/lib/auth-client";

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          router.push("/products");
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

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate Stripe processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add the mock order to the mock API
      await mockApi.createOrder({
        buyerId: session?.user?.id || "buyer_123",
        productId: product._id,
        productTitle: product.title,
        price: product.price,
      });

      setPaymentSuccess(true);
      
      // Redirect to dashboard after showing success message briefly
      setTimeout(() => {
        router.push("/dashboard/buyer");
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-4">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-6 animate-pulse">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-400">Thank you for your purchase. Redirecting to your dashboard...</p>
      </div>
    );
  }

  const shippingCost = 15;
  const tax = Math.round(product.price * 0.08 * 100) / 100; // 8% mock tax
  const total = product.price + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href={`/products/${id}`} className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Product
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Checkout Form (Left side) */}
          <div className="w-full lg:w-2/3 space-y-8">
            <h1 className="text-3xl font-bold text-white font-outfit">Secure Checkout</h1>
            
            <form onSubmit={handlePayment} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8">
                <h2 className="text-xl font-bold text-white mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">First Name</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Last Name</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm text-gray-400">Street Address</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">City</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">ZIP / Postal Code</label>
                    <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="10001" />
                  </div>
                </div>
              </div>

              {/* Mock Payment UI */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Payment Details</h2>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs">Visa</div>
                    <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center text-xs">MC</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Card Information</label>
                    <div className="relative">
                      <input 
                        required 
                        type="text" 
                        maxLength="19"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-black/50 border border-white/10 rounded-t-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
                      />
                      <svg className="w-6 h-6 text-gray-500 absolute right-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-0">
                      <input 
                        required 
                        type="text" 
                        placeholder="MM / YY"
                        className="w-full bg-black/50 border border-t-0 border-white/10 rounded-bl-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
                      />
                      <input 
                        required 
                        type="text" 
                        placeholder="CVC"
                        maxLength="4"
                        className="w-full bg-black/50 border border-t-0 border-l-0 border-white/10 rounded-br-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary (Right side) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-white font-medium line-clamp-2 leading-tight">{product.title}</h3>
                  <p className="text-emerald-400 font-bold mt-1">${product.price}</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-white/10">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
