"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getReviews, checkReviewEligibility, submitReview, updateReview, deleteReview, addSellerResponse } from "@/lib/api/reviews";
import { useSession } from "@/lib/auth-client";
import { AlertDialog, Button, toast, Form, TextArea, TextField } from "@heroui/react";

export default function ProductReviews({ product }) {
  const productId = product?._id;
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [isEligible, setIsEligible] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Edit State
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editImage, setEditImage] = useState("");

  // Seller Response State
  const [replyingToId, setReplyingToId] = useState(null);
  const [sellerResponseText, setSellerResponseText] = useState("");

  const isSeller = session?.user?.id === product?.sellerId;

  const fetchReviewsAndEligibility = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const data = await getReviews(productId);
      if (data) setReviews(data);

      if (session?.user?.id && !isSeller) {
        const eligibilityData = await checkReviewEligibility(productId, session.user.id);
        if (eligibilityData) {
          setIsEligible(eligibilityData.eligible);
          setAlreadyReviewed(eligibilityData.alreadyReviewed);
          if (eligibilityData.existingReview) {
            setExistingReview(eligibilityData.existingReview);
          }
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
  }, [productId, session, isSeller]);

  const handleImageUpload = async (e, setImageState) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMG_API}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageState(data.data.display_url);
      } else {
        toast.danger("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.danger("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.warning("Please provide a rating and a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const resData = await submitReview({
        productId,
        reviewerInfo: {
          userId: session.user.id,
          name: session.user.name || "Anonymous",
        },
        rating,
        comment: comment.trim(),
        image: image || null,
      });

      if (resData) {
        setComment("");
        setRating(0);
        setImage("");
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

  const handleEditSubmit = async (e, reviewId) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resData = await updateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
        image: editImage || null
      });
      if (resData) {
        setEditingReviewId(null);
        await fetchReviewsAndEligibility();
      }
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      await fetchReviewsAndEligibility();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleSellerResponse = async (e, reviewId) => {
    e.preventDefault();
    if (!sellerResponseText.trim()) return;
    setSubmitting(true);
    try {
      await addSellerResponse(reviewId, sellerResponseText.trim());
      setReplyingToId(null);
      setSellerResponseText("");
      await fetchReviewsAndEligibility();
    } catch (error) {
      console.error("Error adding seller response:", error);
      toast.error("Failed to add seller response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating, interactive = false, onHover, onClick) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && onHover && onHover(star)}
          onMouseLeave={() => interactive && onHover && onHover(0)}
          onClick={() => interactive && onClick && onClick(star)}
          className={`material-symbols-outlined ${interactive ? "text-2xl cursor-pointer" : "text-[16px]"} transition-colors ${
            currentRating >= star
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          } ${!interactive && !isEligible ? "" : ""}`}
          style={{ fontVariationSettings: currentRating >= star ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-800 w-full">
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 tracking-tight">Product Reviews</h3>

      {/* Write a Review Section */}
      {!isSeller && (
        <div className="mb-12 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Write a Review</h4>
          {!session ? (
            <p className="text-zinc-500 font-medium">Please sign in to leave a review.</p>
          ) : alreadyReviewed ? (
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="font-medium">You have already reviewed this product.</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} className="space-y-4" validationBehavior="native">
              <div className="mb-2">
                {renderStars(hoverRating || rating, isEligible, setHoverRating, setRating)}
              </div>
              
              <TextField>
                <TextArea
                  minRows={4}
                  className={`w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors shadow-sm rounded-lg py-3 px-4 text-zinc-900 dark:text-white ${!isEligible ? "cursor-not-allowed opacity-75" : ""}`}
                  placeholder={isEligible ? "Share your experience with this product..." : "You can only review this product after purchasing and receiving it."}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  isDisabled={!isEligible || submitting}
                />
              </TextField>
              
              {isEligible && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage || submitting}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl transition-colors text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                      {uploadingImage ? "Uploading..." : "Add Photo (Optional)"}
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e, setImage)}
                      className="hidden"
                    />
                    {image && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                        <Image src={image} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => setImage("")} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white text-[16px]">close</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    isDisabled={submitting || !rating || !comment.trim()}
                    isLoading={submitting}
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold rounded-xl transition-colors"
                  >
                    Submit Review
                  </Button>
                </div>
              )}
            </Form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">
          Customer Reviews ({reviews.length})
        </h4>
        
        {loading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              const isAuthor = session?.user?.id === review.reviewerInfo.userId;
              const isEditing = editingReviewId === review._id;
              const isReplying = replyingToId === review._id;

              return (
                <div key={review._id} className="pb-6 border-b border-gray-200 dark:border-white/5 last:border-0 last:pb-0">
                  {isEditing ? (
                    <Form onSubmit={(e) => handleEditSubmit(e, review._id)} className="space-y-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800" validationBehavior="native">
                      <div className="flex justify-between items-center mb-2 w-full">
                        <h5 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs">Edit Review</h5>
                        <button type="button" onClick={() => setEditingReviewId(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                      <div className="mb-2">
                        {renderStars(hoverRating || editRating, true, setHoverRating, setEditRating)}
                      </div>
                      <TextField className="w-full">
                        <TextArea
                          minRows={3}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          isDisabled={submitting}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-900 dark:focus-within:border-white transition-colors shadow-sm rounded-xl py-2 px-3 text-zinc-900 dark:text-white font-medium"
                        />
                      </TextField>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                            {uploadingImage ? "Uploading..." : "Change Photo"}
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, setEditImage)}
                              className="hidden"
                            />
                          </label>
                          {editImage && (
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                              <Image src={editImage} alt="Preview" fill className="object-cover" />
                              <button type="button" onClick={() => setEditImage("")} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="material-symbols-outlined text-white text-[12px]">close</span>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" onPress={() => setEditingReviewId(null)} variant="light" size="sm" className="font-bold uppercase tracking-wider rounded-xl cursor-pointer">Cancel</Button>
                          <Button type="submit" isDisabled={submitting || !editRating || !editComment.trim()} isLoading={submitting} size="sm" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider rounded-xl shadow-sm cursor-pointer">Save Changes</Button>
                        </div>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white">{review.reviewerInfo?.name}</p>
                            <span className="flex items-center gap-1 text-zinc-500">
                              <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-600 text-white shadow-sm" title="Verified Buyer">
                                <span className="material-symbols-outlined text-[9px] font-bold">check</span>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest">Verified Buyer</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()} {review.updatedAt && "(Edited)"}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {renderStars(review.rating)}
                          
                          {isAuthor && (
                            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingReviewId(review._id);
                                  setEditRating(review.rating);
                                  setEditComment(review.comment);
                                  setEditImage(review.image || "");
                                }} 
                                className="cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Edit"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              
                              <AlertDialog>
                                <Button variant="light" size="sm" className="cursor-pointer min-w-0 p-0 text-zinc-500 hover:text-red-500 bg-transparent data-[hover=true]:bg-transparent">
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </Button>
                                <AlertDialog.Backdrop>
                                  <AlertDialog.Container>
                                    <AlertDialog.Dialog className="rounded-2xl border border-zinc-200 dark:border-zinc-800/50 shadow-xl bg-white dark:bg-zinc-900 sm:max-w-[400px]">
                                      <AlertDialog.CloseTrigger />
                                      <AlertDialog.Header className="border-b border-zinc-200 dark:border-zinc-800/50 pb-4 pt-6">
                                        <AlertDialog.Heading className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Delete Review?</AlertDialog.Heading>
                                      </AlertDialog.Header>
                                      <AlertDialog.Body className="py-6">
                                        <p className="text-zinc-600 dark:text-zinc-400 font-medium">Are you sure you want to delete this review? This action cannot be undone.</p>
                                      </AlertDialog.Body>
                                      <AlertDialog.Footer className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4 pb-6">
                                        <Button slot="close" variant="flat" className="rounded-xl font-medium cursor-pointer">Cancel</Button>
                                        <Button slot="close" className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors cursor-pointer" onPress={() => handleDelete(review._id)}>Delete</Button>
                                      </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                  </AlertDialog.Container>
                                </AlertDialog.Backdrop>
                              </AlertDialog>
                            </div>
                          )}
                          
                          {isSeller && !review.sellerResponse && (
                            <button onClick={() => setReplyingToId(review._id)} className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">reply</span> Reply
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3 whitespace-pre-wrap">
                        {review.comment}
                      </p>
                      
                      {review.image && (
                        <div className="mt-4 relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 group cursor-pointer">
                          <Image src={review.image} alt="Review attachment" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      
                      {/* Seller Response Display */}
                      {review.sellerResponse && (
                        <div className="mt-5 ml-6 pl-5 border-l-2 border-zinc-200 dark:border-zinc-800">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mb-2 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[14px]">storefront</span> Seller Response
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{review.sellerResponse.text}</p>
                        </div>
                      )}
                      
                      {/* Seller Reply Form */}
                      {isReplying && (
                        <Form onSubmit={(e) => handleSellerResponse(e, review._id)} className="mt-4 ml-6 space-y-3" validationBehavior="native">
                          <TextField>
                            <TextArea
                              placeholder="Write your response to the buyer..."
                              value={sellerResponseText}
                              onChange={(e) => setSellerResponseText(e.target.value)}
                              isDisabled={submitting}
                              minRows={2}
                              className="w-full bg-white dark:bg-black/50 border border-blue-200 dark:border-blue-500/20 hover:border-blue-500/50 focus-within:border-blue-500 transition-colors shadow-sm rounded-lg py-2 px-3 text-gray-900 dark:text-white text-sm"
                            />
                          </TextField>
                          <div className="flex gap-2 justify-end w-full">
                            <Button type="button" onPress={() => setReplyingToId(null)} variant="light" size="sm">Cancel</Button>
                            <Button type="submit" isDisabled={submitting || !sellerResponseText.trim()} isLoading={submitting} color="primary" size="sm" className="bg-blue-500 text-white">Post Reply</Button>
                          </div>
                        </Form>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
