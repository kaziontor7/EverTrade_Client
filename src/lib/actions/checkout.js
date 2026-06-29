"use server";

import { serverMutation, revalidate } from "../core/server";

export const syncCheckoutAction = async (checkoutData) => {
    const res = await serverMutation("checkout/success", checkoutData, "POST");
    
    if (res.success || res.message === "Already processed") {
        await revalidate("/cart");
        await revalidate("/dashboard/buyer");
        await revalidate("/dashboard/buyer/orders");
        await revalidate("/dashboard/seller");
        await revalidate("/dashboard/seller/orders");
    }
    
    return res;
};
