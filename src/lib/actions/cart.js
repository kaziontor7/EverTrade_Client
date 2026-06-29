"use server";

import { serverMutation, serverFetch, revalidate } from "../core/server";

export const getCartAction = async (userId) => {
    return await serverFetch(`cart?userId=${userId}`);
};

export const addToCartAction = async (cartData) => {
    const res = await serverMutation("cart", cartData, "POST");
    if (res.acknowledged) {
        await revalidate("/cart");
    }
    return res;
};

export const updateCartAction = async (cartData) => {
    const res = await serverMutation("cart", cartData, "POST");
    if (res.acknowledged) {
        await revalidate("/cart");
    }
    return res;
};

export const deleteFromCartAction = async (productId, userId) => {
    const res = await serverMutation(`cart/${productId}?userId=${userId}`, {}, "DELETE");
    if (res.acknowledged) {
        await revalidate("/cart");
    }
    return res;
};

export const clearCartAction = async (userId) => {
    const res = await serverMutation(`cart/clear/${userId}`, {}, "DELETE");
    if (res.acknowledged) {
        await revalidate("/cart");
    }
    return res;
};
