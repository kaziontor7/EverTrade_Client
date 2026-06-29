"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function ProductReviews({ productId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchReviewsAndEligibility = async () => {
    try {
      setLoading(true);
      const reviewsRes = await fetch(`${API_URL}/reviews/${productId}`);
      if (reviewsRes.ok) {
        setReviews(await reviewsRes.json());
      }

      if (session?.user?.id) {
        const eligibilityRes = await fetch(`${API_URL}/reviews/eligibility/${productId}/${session.user.id}`);
        if (eligibilityRes.ok) {
          const { eligible } = await eligibilityRes.json();
          setIsEligible(eligible);
        }
      }
    } catch (error) {
      console.error("Failed to load reviews or eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsAndEligibility();
  }, [productId, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          reviewerInfo: {
            userId: session.user.id,
            name: session.user.name || "Anonymous",
          },
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        setComment("");
        setRating(0);
        await fetchReviewsAndEligibility();
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-outfit">Product Reviews</h3>

      {/* Write a Review Section */}
      <div className="mb-10 bg-gray-50 dark:bg-black/30 p-6 rounded-2xl border border-gray-200 dark:border-white/5">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Write a Review</h4>
        {!session ? (
          <p className="text-gray-500 dark:text-gray-400">Please sign in to leave a review.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={!isEligible}
                  onMouseEnter={() => isEligible && setHoverRating(star)}
                  onMouseLeave={() => isEligible && setHoverRating(0)}
                  onClick={() => isEligible && setRating(star)}
                  className={`material-symbols-outlined text-2xl transition-colors ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  } ${!isEligible ? "opacity-50 cursor-not-allowed" : ""}`}
                  style={{ fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </button>
              ))}
            </div>
            
            <textarea
              className={`w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors min-h-[120px] ${!isEligible ? "cursor-not-allowed opacity-75" : ""}`}
              placeholder={isEligible ? "Share your experience with this product..." : "You can only review this product after purchasing and receiving it."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!isEligible || submitting}
            />
            
            {isEligible && (
              <button
                type="submit"
                disabled={submitting || !rating || !comment.trim()}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            )}
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Customer Reviews ({reviews.length})
        </h4>
        
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="pb-6 border-b border-gray-200 dark:border-white/5 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{review.reviewerInfo?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`material-symbols-outlined text-[16px] ${
                          review.rating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                        }`}
                        style={{ fontVariationSettings: review.rating >= star ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
