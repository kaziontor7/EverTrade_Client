"use server"

import { serverMutation } from "../core/server"
import { revalidatePath } from "next/cache";

export const createProduct = async (productData) => {
    const result = await serverMutation("products", productData, "POST");
    revalidatePath("/dashboard/seller");
    revalidatePath("/dashboard/seller/products");
    revalidatePath("/products");
    return result;
} 

export const updateProductAction = async (id, productData) => {
    const result = await serverMutation(`products/${id}`, productData, "PATCH");
    revalidatePath("/dashboard/seller");
    revalidatePath("/dashboard/seller/products");
    revalidatePath("/products");
    return result;
}

export const deleteProductAction = async (id) => {
    const result = await serverMutation(`products/${id}`, null, "DELETE");
    revalidatePath("/dashboard/seller");
    revalidatePath("/dashboard/seller/products");
    revalidatePath("/products");
    return result;
}