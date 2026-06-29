'use server'

import { protectedFetch, serverMutation } from "../core/server";

export const getAdminStats = async () => {
    return await protectedFetch(`admin/stats`);
}

export const getAdminAnalytics = async () => {
    return await protectedFetch(`admin/analytics`);
}

export const getAdminOrders = async () => {
    return await protectedFetch(`admin/orders`);
}

export const deleteProduct = async (id) => {
    return await serverMutation(`products/${id}`, null, "DELETE");
}
export const toggleSellerVerification = async (userId, isVerified) => {
    return await serverMutation(`admin/users/${userId}/verify`, { isVerified }, "PATCH");
}
export const forceUpdateOrderStatus = async (orderId, status) => {
    return await serverMutation(`orders/${orderId}/status`, { status }, "PATCH");
}

export const moderateProduct = async (productId, status) => {
    return await serverMutation(`products/${productId}`, { moderationStatus: status }, "PATCH");
}
