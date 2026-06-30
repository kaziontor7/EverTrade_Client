'use server'

import { serverFetch, protectedFetch, serverMutation } from "../core/server";

export const getProductsBySellerId = async (sellerId) => {
    const res = await protectedFetch(`products?sellerId=${sellerId}`)
    return res;
}

export const getProducts = async () => {
    const res = await serverFetch(`products`)
    return res;
}

export const getProductById = async (id) => {
    const res = await serverFetch(`products/${id}`)
    return res;
}

export const reportProduct = async (id) => {
    const res = await serverMutation(`products/${id}/report`, null, "PATCH");
    return res;
}