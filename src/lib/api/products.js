'use server'

import { serverFetch } from "../core/server";





export const getProductsBySellerId = async (sellerId) => {
    const res = await serverFetch(`products?sellerId=${sellerId}`)
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