'use server'

import { protectedFetch, serverMutation } from "../core/server";

export const getSellerOrders = async (sellerId) => {
    return await protectedFetch(`orders/seller/${sellerId}`);
}

export const getBuyerOrders = async (buyerId) => {
    return await protectedFetch(`orders/buyer/${buyerId}`);
}

export const updateOrderStatus = async (orderId, status) => {
    return await serverMutation(`orders/${orderId}/status`, { status }, "PATCH");
}
