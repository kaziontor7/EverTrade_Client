"use server"

import { serverMutation } from "../core/server"

export const createProduct = async (productData) => {
    return await serverMutation("products", productData, "POST");
} 