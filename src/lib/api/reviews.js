'use server'

import { protectedFetch, serverFetch, serverMutation } from "../core/server";

export const getReviews = async (productId) => {
    return await serverFetch(`reviews/${productId}`);
}

export const checkReviewEligibility = async (productId, userId) => {
    return await protectedFetch(`reviews/eligibility/${productId}/${userId}`);
}

export const submitReview = async (reviewData) => {
    return await serverMutation(`reviews`, reviewData, "POST");
}

export const updateReview = async (reviewId, reviewData) => {
    return await serverMutation(`reviews/${reviewId}`, reviewData, "PATCH");
}

export const deleteReview = async (reviewId) => {
    return await serverMutation(`reviews/${reviewId}`, null, "DELETE");
}

export const addSellerResponse = async (reviewId, response) => {
    return await serverMutation(`reviews/${reviewId}/response`, { response }, "PATCH");
}
