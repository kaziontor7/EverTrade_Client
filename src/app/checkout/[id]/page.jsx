"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockApi } from "@/services/mockApi";
import { useSession } from "@/lib/auth-client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";

// Load stripe with a dummy public key for the assessment
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function CheckoutForm({ product, session, onSuccess, isProcessing, setIsProcessing }) {
  const stripe = useStripe();
  const elements = useElements();
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    try {
      // Create a payment method to verify card details (mock API doesn't need clientSecret for this simple check)
      const cardElement = elements.getElement(CardElement);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error("Payment error:", error);
        alert(error.message);
        setIsProcessing(false);
        return;
      }

      // Simulate processing delay for the assignment mockup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the mock order to the mock API
      await mockApi.createOrder({
        buyerId: session?.user?.id || "buyer_123",
        productId: product._id,
        productTitle: product.title,
        price: product.price,
      });

      onSuccess();
      
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const CARD_OPTIONS = {
    style: {
      base: {
        iconColor: resolvedTheme === 'dark' ? '#34d399' : '#059669',
        color: resolvedTheme === 'dark' ? '#e2e8f0' : '#111827',
        fontWeight: 500,
        fontFamily: 'Outfit, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        '::placeholder': { color: resolvedTheme === 'dark' ? '#94a3b8' : '#9ca3af' },
      },
      invalid: {
        iconColor: '#ef4444',
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Information */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">First Name</label>
            <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="John" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Last Name</label>
            <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Doe" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Street Address</label>
            <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="123 Main St" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">City</label>
            <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="New York" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">ZIP / Postal Code</label>
            <input required type="text" className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="10001" />
          </div>
        </div>
      </div>

      {/* Stripe Payment Elements */}
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20">
            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400">lock</span>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Payments are securely processed by <strong>Stripe</strong>. Your card details are never stored on our servers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10">
            <CardElement options={CARD_OPTIONS} />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isProcessing || !stripe}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing Secure Payment...
          </>
        ) : (
          `Pay ৳${(product.price + 15 + Math.round(product.price * 0.08 * 100) / 100).toLocaleString()}`
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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

  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  const shippingCost = 15;
  const tax = Math.round(product.price * 0.08 * 100) / 100; // 8% mock tax
  const total = product.price + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-40"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href={`/products/${id}`} className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium mb-8 transition-colors">
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Product
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Checkout Form (Left side) */}
          <div className="w-full lg:w-2/3 space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-outfit">Secure Checkout</h1>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                product={product} 
                session={session} 
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                onSuccess={() => router.push("/checkout/success")}
              />
            </Elements>
            
          </div>

          {/* Order Summary (Right side) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-black/50 shrink-0">
                  <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">{product.title}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">৳{product.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4 py-6 border-t border-b border-gray-200 dark:border-white/10">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">৳{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">৳{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">৳{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mt-6">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
