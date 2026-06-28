import { serverMutation } from "../core/server";

export const createWish = async (wishlistData) => {
    return await serverMutation("wishlist", wishlistData, "POST");
}

export const deleteWish = async (id) => {
    return await serverMutation(`wishlist/${id}`, {}, "DELETE");
}
