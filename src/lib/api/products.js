'use server'

import { serverFetch, protectedFetch, serverMutation } from "../core/server";

export const getProductsBySellerId = async (sellerId) => {
    const res = await protectedFetch(`products?sellerId=${sellerId}`)
    return res;
}

export const getProducts = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    
    const qs = query.toString();
    const res = await serverFetch(`products${qs ? `?${qs}` : ''}`)
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